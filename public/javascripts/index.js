const url = 'http://localhost:3000/';

fetch(url + "search/authors", {
    method: 'GET'
}).then((res) => {
    if (res.ok) {
        res.json().then((json) => {
            console.log(json);

            for (let i = 0; i < json.length; i++) {
                const opt = document.createElement('option');
                opt.id = 'authors';

                for (let key in json[i]) {
                    console.log(`json[${i}] = ${key} ${json[i]._id}`);
                }

                opt.text = json[i]._id;
                opt.onclick = async () => {
                    const correctUrl = url + "search/byAuthor?";

                    if (opt.text || opt.text.length !== 0) {
                        await sendRequest({author: opt.text}, correctUrl);
                    }
                };
                document.getElementById('authors').appendChild(opt);
            }
        });
    }
});

async function getAll() {
    const correctUrl = url + "search/all";
    await sendRequest({}, correctUrl);
}

async function onSearchByAuthor() {
    const correctUrl = url + "search/byAuthor?";
    const text = document.getElementById("search").value;

    if (!text || text.length === 0) {
        alert("Search Field id empty!");
        return;
    }

    await sendRequest({author: text}, correctUrl);
}

async function onSearchName() {
    const correctUrl = url + "search/byName?";
    const text = document.getElementById("search").value;

    if (!text || text.length === 0) {
        alert("Search Field id empty!");
        return;
    }

    await sendRequest({name: text}, correctUrl);
}

async function onSearchByDate() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (end < start) {
        alert('End date must be grater or equal to start date');
        return;
    }

    const correctUrl = url + 'search/betweenDates?';
    await sendRequest({start: start, end: end}, correctUrl);
}

function validate(container) {
    const isValid = (/^\w+(?:,\s.\w+(?:\w*\s*)*)*$/).test(container.value);
    const byName = document.getElementById('byName');
    const byAuthor = document.getElementById('byAuthor');

    if (isValid) {
        container.style.backgroundColor = '#bfa';
        byName.disabled = false;
        byAuthor.disabled = false;
    } else {
        container.style.backgroundColor = '#e38168';
        byName.disabled = true;
        byAuthor.disabled = true;
    }

    return isValid;
}

async function sendRequest(object, correctUrl) {
    const response = await fetch(correctUrl + (
        Object.keys(object).length !== 0 ? new URLSearchParams(object) : ''
    ), {
        method: 'GET'
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        fillTable(json);
    } else {
        alert("Incorrect request");
    }
}

function fillTable(json) {
    let table = document.getElementById('articles');

    removeTable(table);

    const contentDiv = document.getElementById("content");
    // table.style.border = '1px solid black';

    for (let i = 0; i < json.length; i++) {
        const tr = table.insertRow();

        const values = Object.values(json[i]);
        for (let j = 0; j < Object.values(json[i]).length; j++) {
            const td = tr.insertCell();
            let text;
            if (j === 0)
                text = i + 1;
            else if (values[j] !== null && values[j] !== undefined)
                text = values[j];
            td.appendChild(document.createTextNode(`${text}`));
            // td.style.border = '1px solid black';
        }

        const td = tr.insertCell();

        const button = document.createElement('button');
        button.innerText = 'More Info';
        button.className = 'btn btn-outline-primary';
        button.id = `more${json[i]._id}`;
        button.onclick = async () => {
            location.href='/info?' + new URLSearchParams({
                id: json[i]._id
            });
        }
        td.appendChild(button);

        const td2 = tr.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete this';
        deleteButton.className = 'btn btn-outline-danger';
        deleteButton.id = `delete${json[i]._id}`;
        deleteButton.onclick = async () => {
            const correctUrl = url + 'delete/byId?';
            const object = { id: json[i]._id };

            const response = await fetch(correctUrl + (
                Object.keys(object).length !== 0 ? new URLSearchParams(object) : ''
            ), {
                method: 'GET'
            });

            if (response.ok) {
                console.log(`successfully re-movement article with id: ${json[i]._id}`);
                removeAuthor(json[i].authors);
                json.splice(i, 1);

                fillTable(json);
            } else {
                alert("Incorrect request");
            }
        }
        td2.appendChild(deleteButton);
    }

    contentDiv.appendChild(table);
}

function removeAuthor(authorNames) {
    const selector = document.getElementById("authors");

    for (let i = 0; i < selector.options.length; i++) {
        const option = selector.options[i];
        if (authorNames.includes(option.text)) {
            selector.remove(i);
            console.log(`removed option number = ${i}`);
        }
    }
}

function removeTable(table) {
    if (!!table && table.rows.length >= 1) {
        while (table.rows.length >= 1) {
            console.log(`rows = ${table.rows.length}`);
            table.deleteRow(0);
        }

        console.log(`rows = ${table.rows.length}`);
    }
}