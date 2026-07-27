let favoriteFiles = [];

window.onload = ()=>{

    loadFavorites();

    document.getElementById("closeModal").onclick = closePreview;

};

window.onclick = function(e){

    const modal = document.getElementById("previewModal");

    if(e.target===modal){

        closePreview();

    }
};


async function loadFavorites(){

    try{

        const res = await fetch("/api/files/favoritefiles");

        const data = await res.json();

        if(!data.success){

            alert(data.message);
            return;

        }

        favoriteFiles = data.files || [];

        renderFavorites(favoriteFiles);

    }
    catch(err){

        console.log(err);

        alert("Failed loading favorites");

    }

}


function renderFavorites(files){

    const grid = document.getElementById("favoriteGrid");

    if(files.length===0){


        grid.innerHTML=`

            <div class="empty">

                <h2>No Favourite Files ⭐</h2>

                <p>Add files to favourites from My Files</p>

            </div>

        `;


        return;

    }

    grid.innerHTML="";

    files.forEach(file=>{

        grid.innerHTML += `

        <div class="file-card favorite">

            <div class="favorite-badge">

                ⭐

            </div>

            <div class="file-top">

                <div class="icon">

                    ${getIcon(file.mimeType)}

                </div>

                <button class="favorite-remove-btn" onclick="removeFavorite('${file._id}')">

                    ⭐

                </button>

            </div>

            <h3>

                ${getFileName(file.originalName)}

            </h3>




            <div class="file-type">

                ${getFileType(file.mimeType)}

            </div>



            <p>

                ${formatSize(file.size)}

            </p>



            <span>

                ${formatDate(file.createdAt)}

            </span>




            <div class="actions">


                <button onclick="previewFile('${file._id}')">

                    👁 Open

                </button>

                <button onclick="downloadFile('${file._id}')">

                    ⬇ Download

                </button>

            </div>

        </div>

        `;
    });
}

async function removeFavorite(id){

    const ok = confirm("Remove this file from Favorites?");

    if(!ok) return;

    const res = await fetch(`/api/files/favorite/${id}`,{

        method:"PUT"

    });

    const data = await res.json();

    if(data.success){

        loadFavorites();

    }else{

        alert(data.message);

    }

}


async function previewFile(id){

    const modal = document.getElementById("previewModal");

    const body = document.getElementById("previewBody");

    modal.style.display = "flex";

    body.innerHTML = `

        <div class="preview-loader">

            Loading preview...

        </div>

    `;

    const res = await fetch(`/api/files/preview/${id}`);

    const data = await res.json();

    if(!data.success){

        alert(data.message);

        closePreview();

        return;

    }

    if(data.mimeType.startsWith("image")){

        body.innerHTML = `
            <img
                src="${data.url}"
                class="preview-image">
        `;

    }

    else if(data.mimeType.startsWith("video")){

        body.innerHTML = `

            <video
                class="preview-video"
                controls
                autoplay>

                <source
                    src="${data.url}"
                    type="${data.mimeType}">

            </video>

        `;

    }

    else if(data.mimeType==="application/pdf"){

        body.innerHTML = `
            <iframe
                class="preview-pdf"
                src="${data.url}">
            </iframe>
        `;

    }

    else{

        body.innerHTML = `
            <iframe
                class="preview-office"
                src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}">
            </iframe>
        `;

    }

}

function closePreview(){

    const modal = document.getElementById("previewModal");

    const body = document.getElementById("previewBody");

    const video = body.querySelector("video");

    if(video){

        video.pause();

        video.currentTime = 0;

    }

    body.innerHTML = "";

    modal.style.display = "none";

}

async function downloadFile(id){

    const res = await fetch(`/api/files/download/${id}`);

    const data = await res.json();

    if(!data.success){

        alert(data.message);
        return;

    }

    const a = document.createElement("a");

    a.href = data.url;

    a.download = "";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}





function getFileName(name){

    const i=name.lastIndexOf(".");


    return i===-1
    ?name
    :name.substring(0,i);

}



function getIcon(type=""){


    type=type.toLowerCase();


    if(type.includes("image"))
        return "🖼";


    if(type.includes("pdf"))
        return "📄";


    if(type.includes("video"))
        return "🎥";


    if(type.includes("word"))
        return "📝";


    if(type.includes("excel"))
        return "📊";


    return "📦";

}




function getFileType(type){


    if(type.includes("image"))
        return "IMAGE";


    if(type.includes("pdf"))
        return "PDF";


    if(type.includes("video"))
        return "VIDEO";


    return "FILE";

}



function formatSize(bytes){


    if(bytes < 1024)
        return bytes+" B";


    if(bytes < 1024*1024)
        return (bytes/1024).toFixed(2)+" KB";


    return (bytes/1024/1024).toFixed(2)+" MB";


}



function formatDate(date){


    return new Date(date)
    .toLocaleString("en-IN");


}