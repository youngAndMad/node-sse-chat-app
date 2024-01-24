document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('username') === null) {
        document.getElementById('openModalButton').click()
    } else {
        startConservation()
    }
})

document.getElementById('enter_chat_button').addEventListener('click', (event) => {
    event.preventDefault()
    document.getElementById('closeUsernameModalButton').click()
    localStorage.setItem('username', document.getElementById('usernameInput').value)

    startConservation()

})

document.getElementById('sendMessageButton').addEventListener('click', (event) => {
    event.preventDefault()
    fetch(`/message?value=${document.getElementById('messageInput').value}&username=${localStorage.getItem('username')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById('messageInput').value = ''
        });
})

const startConservation = () => {
    const messagesContainer = document.getElementById('messages');

    const sse = new EventSource(`/sse?username=${localStorage.getItem('username')}`);

    sse.onmessage = (event) => {
        const message = event.data;
        messagesContainer.innerHTML += `<p>${message}</p>`;
        console.log('onmessage' , event)
    };

    sse.onopen = (event) => {
        console.log(`Connected with User ID:  ${JSON.stringify(event)}`);
    };

    sse.onerror = (error) => {
        console.error('EventSource failed:', error);
        sse.close();
    };
}