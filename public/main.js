const apiButton = document.getElementById('apiButton');

if (apiButton) {
  apiButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/api');
      const data = await response.json();

      if (data.message === 'Запрос прошел успешно') {
        console.log(data.message);
        return;
      }

      console.error('Неожиданный ответ от сервера:', data);
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  });
}
