import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

/**
 * 🔍 Récupère la liste des documents
 */
export const fetchDocuments = async () => {
    const query = `
    query {
      documents {
        id
        name
        size
        url
        createdAt
      }
    }
  `;

    try {
        const response = await axios.post(API_URL, { query });
        return response.data.data.documents;
    } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        throw error;
    }
};

/**
 * 📤 Téléverse un document vers l'API
 * @param file Fichier à téléverser
 */
export const uploadDocument = async (file: File) => {
    const mutation = `
    mutation($file: Upload!) {
      uploadDocument(file: $file) {
        id
        name
        size
        url
        createdAt
      }
    }
  `;

    const formData = new FormData();
    formData.append("operations", JSON.stringify({ query: mutation, variables: { file: null } }));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", file, file.name);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data.uploadDocument;
    } catch (error) {
        console.error("Erreur lors du téléversement du document:", error);
        throw error;
    }
};

/**
 * 🗑️ Supprime un document
 * @param documentId ID du document à supprimer
 */
export const deleteDocument = async (documentId: string) => {
    const mutation = `
    mutation {
      deleteDocument(id: "${documentId}") {
        success
        message
      }
    }
  `;

    try {
        const response = await axios.post(API_URL, { query: mutation });
        return response.data.data.deleteDocument;
    } catch (error) {
        console.error("Erreur lors de la suppression du document:", error);
        throw error;
    }
};
