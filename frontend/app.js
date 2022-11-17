const form = document.querySelector("form");
const tableBody = document.querySelector("tbody");
const table = document.querySelector("table");
const url = "http://localhost:8080/users";
const fetchBtn = document.querySelector("#fetch");
let users = [];

async function fetchData(options = { method: "GET" }) {
    let errMsg = document.querySelector("#error");
    if (errMsg) {
        errMsg.remove()
    }
    try {
        let response = await fetch(url, options)
        let data = await response.json();
        if (data.error) {
            form.innerHTML += `<div id="error">${data.error}</div>`
        } else {
            if (options.method === "POST") {
                let arr = [data]
                users.push(data)
                addRow(arr);

            }
            if (options.method === "GET") {
                users = [...data]
                addRow(data);
            }
        }


        return data;
    } catch (err) {
        console.log("ERROR!!", err)
    }
}

(function getData() {
    fetchData({ method: "GET" })
})()
function edit() {
    const editBtn = document.querySelectorAll("td .edit");
    [...editBtn].forEach(btn => {

        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            let rowEmail = event.target.attributes["data-belongtobtn"].nodeValue;
            let rowInputs = [...document.querySelectorAll(`[data-belongto="${rowEmail}"]`)];
            rowInputs.forEach(input => {
                input.previousElementSibling.classList.toggle("d-none");
                input.classList.toggle("d-none");

            })
            event.target.parentNode.nextElementSibling.classList.toggle("d-none")
        })
    })
}

function submitEdit() {
    const saveUpdates = [...document.querySelectorAll("td .save")];
    saveUpdates.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            let rowEmail = event.target.attributes["data-belongtobtn"].nodeValue;
            let rowInputs = [...document.querySelectorAll(`[data-belongto="${rowEmail}"]`)];
            let userData = users.find(user => user.email === rowEmail);
            let data = { id: userData._id };
            rowInputs.forEach(input => {
                if (userData[input.name] != input.value) {
                    data[input.name] = input.value
                }

            })


            let res = fetchData({
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            res.then(data => {
                if (data.body.modifiedCount > 0) {
                    rowInputs.forEach(input => {
                        input.previousElementSibling.innerHTML = input.value
                        input.previousElementSibling.classList.toggle("d-none");
                        input.classList.toggle("d-none");
                    })
                    event.target.parentNode.classList.toggle("d-none");

                }
            })
        })
    })
}

function deleteUser() {
    const deleteBtns = [...document.querySelectorAll("td .delete-btn")];
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            let rowEmail = e.target.attributes["data-belongtobtn"].nodeValue;

            let res = fetchData({
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: rowEmail })
            }).then(data => {
                if (data.msg) {
                    const targetChild = document.querySelector(`[data-belongto="${rowEmail}"]`);
                    targetChild.parentNode.parentNode.remove()
                    users = users.filter(user => user.email !== rowEmail);
                    // addRow(users)
                }
            })

        })
    })
}

function addRow(arr) {
    arr.forEach(user => {
        const props = { firstname: user.firstname, lastname: user.lastname, email: user.email, age: user.age }
        const row = table.insertRow();
        row.insertCell().innerHTML = users.findIndex(obj => obj.email === user.email) + 1
        for (const prop in props) {
            let cell = row.insertCell();
            if (prop === "email") {
                cell.innerHTML = `
                <span>
            ${user[prop]} 
            </span>
                <input type="email" value="${user[prop]}" class="form-control" id=${user.firstname}-${prop}>
            `
            }
            cell.innerHTML = `
            <span>
            ${user[prop]} 
            </span>
                <input type="text" value="${user[prop]}" data-belongto="${user.email}" name="${prop}" class="form-control d-none" id=${user.firstname}-${prop}>
            `
        }
        row.insertCell().innerHTML = `
                 <div class="row">
                <div class="col ">
                <button type="button" class="btn btn-primary edit" data-belongToBtn="${user.email}" >Edit <i
                class="bi bi-gear-fill" style="pointer-events:none"></i></button>
                </div>
                <div class="col d-none">
                <button type="button" class="btn btn-success save" data-belongToBtn="${user.email}" >Save <i class="bi bi-upload"></i></button>
                </div>
                <div class="col ">
                <button type="button" class="btn btn-danger delete-btn" data-belongToBtn="${user.email}" >Delete <i class="bi bi-trash3"></i></button>
                </div>
            </div>
                 `

    })
    edit();
    submitEdit();
    deleteUser()
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {}
    const inputs = [...document.querySelectorAll("form input")];
    inputs.forEach(input => {
        data[input.name] = input.value
    })
    fetchData({
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })


})


