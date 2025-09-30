import React, { useState, useEffect, useRef } from 'react';
import { Client } from '../types';
import { Card } from '../components/Card';
import { ClientModal } from '../components/ClientModal';

const ClientsView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      }
    } catch (error) {
      console.error("Failed to load clients from localStorage:", error);
      setClients([]);
    }
  }, []);

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
    try {
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    } catch (error) {
      console.error("Failed to save clients to localStorage:", error);
    }
  };

  const handleAddClient = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const updatedClients = clients.filter(c => c.id !== clientId);
      saveClients(updatedClients);
    }
  };

  const handleSaveClient = (client: Omit<Client, 'id'> & { id?: string }) => {
    if (client.id) { // Editing existing client
      const updatedClients = clients.map(c => c.id === client.id ? { ...c, ...client } : c);
      saveClients(updatedClients);
    } else { // Adding new client
      const newClient: Client = { ...client, id: Date.now().toString() };
      saveClients([newClient, ...clients]);
    }
    setIsModalOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClients = () => {
    if (clients.length === 0) {
      alert("There are no clients to export.");
      return;
    }

    const escapeCsvField = (field: string) => {
      const stringField = String(field || '');
      if (/[",\n]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    const header = ['name', 'company', 'email', 'notes'];
    const csvRows = [
      header.join(','),
      ...clients.map(client =>
        [
          escapeCsvField(client.name),
          escapeCsvField(client.company),
          escapeCsvField(client.email),
          escapeCsvField(client.notes),
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      alert('Please select a valid CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length <= 1) {
          alert("CSV file is empty or contains only a header.");
          return;
        }

        const header = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const requiredHeaders = ['name', 'email'];
        if (!requiredHeaders.every(h => header.includes(h))) {
          alert('CSV header must contain "name" and "email" columns.');
          return;
        }
        
        const nameIndex = header.indexOf('name');
        const companyIndex = header.indexOf('company');
        const emailIndex = header.indexOf('email');
        const notesIndex = header.indexOf('notes');

        const newClients: Client[] = [];
        let skippedCount = 0;
        const existingEmails = new Set(clients.map(c => c.email.toLowerCase()));

        for (let i = 1; i < rows.length; i++) {
          const columns = rows[i].split(',').map(c => c.trim().replace(/"/g, ''));
          const email = columns[emailIndex];
          const name = columns[nameIndex];

          if (!name || !email) {
            continue; // Skip rows with missing required fields
          }
          
          if (existingEmails.has(email.toLowerCase())) {
            skippedCount++;
            continue; // Skip duplicate email
          }

          const newClient: Client = {
            id: `${Date.now()}-${i}`,
            name: name,
            email: email,
            company: columns[companyIndex] || '',
            notes: columns[notesIndex] || '',
          };
          newClients.push(newClient);
          existingEmails.add(email.toLowerCase()); // Avoid duplicates within the same file
        }

        if (newClients.length > 0) {
          saveClients([...newClients.reverse(), ...clients]);
        }

        let alertMessage = `${newClients.length} clients imported successfully.`;
        if (skippedCount > 0) {
          alertMessage += `\n${skippedCount} duplicate clients were skipped.`;
        }
        alert(alertMessage);

      } catch (error) {
        console.error("Error parsing CSV file:", error);
        alert('An error occurred while parsing the CSV file.');
      } finally {
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    
    reader.onerror = () => {
        alert('Failed to read the file.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Client Database</h2>
        <div className="flex items-center gap-2">
            <button
              onClick={handleExportClients}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Export Clients
            </button>
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Import Clients
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".csv"
              style={{ display: 'none' }}
            />
            <button
              onClick={handleAddClient}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Client
            </button>
        </div>
      </div>

      <Card>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md mb-4 border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Tip:</strong> You can import clients from a CSV file. The file must contain a header row with columns: <code>name</code>, <code>email</code>, <code>company</code>, and <code>notes</code>. Columns <code>name</code> and <code>email</code> are required.
                <br />
                <strong>Important:</strong> To ensure correct parsing, please make sure no fields in your CSV contain commas.
            </p>
        </div>
        {clients.length === 0 ? (
          <p className="text-center text-gray-500">No clients yet. Add one or import a CSV file to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clients.map(client => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{client.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEditClient(client)} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">Edit</button>
                      <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {isModalOpen && (
        <ClientModal
          client={currentClient}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
};

export default ClientsView;