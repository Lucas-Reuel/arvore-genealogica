let members = [];
let selectedMember = null;
let treeContainer = document.getElementById("tree-container");
let canvas = document.getElementById("connections");
let ctx = canvas.getContext("2d");
let trash = document.getElementById("trash");

function addMember() {
    const name = document.getElementById("name").value.trim();
    const birthplace = document.getElementById("birthplace").value.trim();
    const birthyear = document.getElementById("birthyear").value;
    const isDeceased = document.getElementById("isDeceased").checked;

    if (!name) {
        alert("Por favor, insira um nome.");
        return;
    }

    let member = {
        id: members.length,
        name,
        birthplace,
        birthyear: birthyear ? parseInt(birthyear) : null,
        isDeceased,
        x: Math.random() * 500,
        y: Math.random() * 300,
        parentId: null
    };

    members.push(member);
    renderTree();
}

function renderTree() {
    treeContainer.innerHTML = "";
    canvas.width = treeContainer.clientWidth;
    canvas.height = treeContainer.clientHeight;

    members.forEach(member => {
        let div = document.createElement("div");
        div.classList.add("member");
        div.textContent = member.name;
        div.style.left = `${member.x}px`;
        div.style.top = `${member.y}px`;
        div.draggable = true;

        div.onclick = function () {
            showInfo(member);
        };

        div.ondragstart = function (event) {
            selectedMember = member;
            trash.classList.remove("hidden");
            event.dataTransfer.setData("text/plain", member.id);
        };

        div.ondragend = function () {
            trash.classList.add("hidden");
            renderTree();
        };

        treeContainer.appendChild(div);
    });

    drawConnections();
}

trash.ondragover = function (event) {
    event.preventDefault();
};

trash.ondrop = function (event) {
    event.preventDefault();
    if (selectedMember) {
        members = members.filter(m => m.id !== selectedMember.id);
        trash.classList.add("hidden");
        renderTree();
    }
};

function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    members.forEach(member => {
        if (member.parentId !== null) {
            let parent = members.find(m => m.id === member.parentId);
            if (parent) {
                ctx.beginPath();
                ctx.moveTo(parent.x + 50, parent.y + 20);
                ctx.lineTo(member.x + 50, member.y);
                ctx.stroke();
            }
        }
    });
}

function showInfo(member) {
    document.getElementById("info-name").textContent = member.name;
    document.getElementById("info-birthplace").textContent = member.birthplace || "Desconhecido";
    document.getElementById("info-birthyear").textContent = member.birthyear || "Desconhecido";
    document.getElementById("info-age").textContent = member.birthyear ? new Date().getFullYear() - member.birthyear : "Desconhecido";
    document.getElementById("info-status").textContent = member.isDeceased ? "Falecido" : "Vivo";

    document.getElementById("edit-fields").classList.add("hidden");
    document.getElementById("info-box").classList.remove("hidden");
    selectedMember = member;
}

function enableEditing() {
    document.getElementById("edit-fields").classList.remove("hidden");
}

function saveEdits() {
    selectedMember.name = document.getElementById("edit-name").value;
    renderTree();
    closeInfo();
}

function closeInfo() {
    document.getElementById("info-box").classList.add("hidden");
}
