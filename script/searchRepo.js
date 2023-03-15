window.addEventListener('load', function() {
    const form = document.querySelector('.form');
    const input = document.querySelector('.form-input');
    const listRepositories = document.querySelector('.list');
    const error = form.querySelector('.msgError')
    const ERROR_TEXT = 'Кол-во символов от 4 до 32 (только лат. буквы и символы: _  .  -)';
    const GITHUB_API_HOST = 'https://api.github.com/search/repositories';

    input.setAttribute('name', 'name');
  
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
  
        const searchValue = input.value.trim();
  
        if (!validator(searchValue)) {
            noValideQuery()
            return;
        }

        valideQuery();
        listRepositories.innerHTML = '';

        const response = await fetch(`${GITHUB_API_HOST}?q=${searchValue}`);

        const data = await response.json();

        if (data.total_count === 0) {
            showNotFound();
            return;
        } 
            
        const min = Math.min(data.total_count, 10);
        for (let i = 0; i < min; i++) {
            const currentRepo = data.items[i]; 
            currentRepo ? addRepository(currentRepo) : showNotFound();
        }
        
    })

    input.addEventListener('click', valideQuery)
  
    function addRepository(data) {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
        <a class="name" href="${data.svn_url}" target="_blank">${data.name}</a>
        <p class="author">автор: ${data.full_name.split('/')[0]}</p>
        <p class="date">дата: ${data.updated_at.slice(0,10)}</p>
        `
        listRepositories.appendChild(item);
    }

    function showNotFound() {
        const notFound = document.createElement('h2');
        notFound.classList.add('not-found');
        notFound.innerText = 'По Вашему запросу нет репозиториев';
        listRepositories.appendChild(notFound);
    }

    function validator(str) {
        const regex = /^[a-zA-Z0-9_.-]{4,32}$/;
        return regex.test(str);
    }

    function noValideQuery() {
        error.innerText = ERROR_TEXT;
        input.classList.add('err');
        listRepositories.innerHTML = '';
    }

    function valideQuery() {
        error.innerText = '';
        input.classList.remove('err');
    }
})