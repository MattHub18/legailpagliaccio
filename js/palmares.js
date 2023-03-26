function insertAtIndex(str, substring, index) {
    return str.slice(0, index) + substring + str.slice(index);
}


getPalmares = (trophies, father, pre) => {
    let palmares = "";
    for (let [id, trophy] of trophies) {
        let className;
        let type = trophy['type'];
        if (type === "gold" || type === "silver" || type === "bronze")
            className = "fa-medal";
        else if (type === "trophy")
            className = "fa-trophy";
        else
            className = "fa-ban";

        const newFather = insertAtIndex(father, `id="${id}"`, father.length - 1);
        palmares +=
            `${newFather}
                ${pre}
                <i class="fas ${className}" id=${type}></i>
                <p>${trophy['date']}</p>
            </div>`;
    }
    return palmares;
}

