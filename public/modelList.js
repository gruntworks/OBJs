// document ready
const http = new XMLHttpRequest();

http.open("GET", "http://localhost:5500/model_list");
http.send();

http.onreadystatechange = e => {
    if (http.readyState == 4 && http.status == 200) {
        console.log(e);
        console.log(http.responseText);
        const data = JSON.parse(http.responseText);

        console.log(data);

        // build
        modelList = {};
        for (let i = 0; i < data.models.length; i++) {
            const { name, path } = data.models[i];
            modelList[name] = path;
        }
        createGui();
    }
};