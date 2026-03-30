const apiUrl = 'http://localhost:3000/';

export const get = (endpoint, userData) => {
    return fetch(`${apiUrl}${endpoint}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        });
};
