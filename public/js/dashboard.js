window.onload = () => {

    initializeUpload();

    loadFiles();

    loadFolders();

    initializeFolder();
}

async function loadFiles(){

    const res=await getFiles();

    const grid=document.getElementById("fileGrid");

    grid.innerHTML="";

    if(res.files.length===0){

        grid.innerHTML=`

            <div class="empty">

                <h2>No Files Uploaded</h2>

                <p>Upload your first file.</p>

            </div>

        `;

        return;

    }

    document.getElementById("fileCount").innerText = res.files.length;

    document.getElementById("recentCount").innerText =
        res.files.filter(file => {
            const uploaded = new Date(file.createdAt);
            const today = new Date();

            return uploaded.toDateString() === today.toDateString();
        }).length;

    const totalBytes = res.files.reduce((sum, file) => sum + file.size, 0);

    const totalGB = totalBytes / (1024 * 1024 * 1024);

    document.getElementById("storageText").innerText = `${formatStorage(totalBytes)} of 10 GB Used`;

    const percentage = (totalBytes / (10 * 1024 * 1024 * 1024)) * 100;

    document.getElementById("storageProgress").style.width = `${Math.min(percentage,100)}%`;

    res.files.forEach(file=>{

        grid.innerHTML+=`

        <div class="file-card">

            <div class="file-top">

                <div class="icon">

                    ${getIcon(file.mimeType)}

                </div>

            </div>

            <h3>${getFileName(file.originalName)}</h3>

            <div class="file-type">

                ${getFileType(file.mimeType)}

            </div>

            <p>${formatSize(file.size)}</p>

            <span>

                ${formatDate(file.createdAt)}

            </span>

        </div>

        `;

    });

}


async function uploadSelectedFile(file){

    try{
        const response=await uploadFile(file);

        if(response.success){
            alert("Upload Successful");
            fileInput.value = "";
            loadFiles();

        }
        else{
            alert(response.message);
        }

    } catch(err){
        console.log(err);
    }

}

function initializeFolder(){


    const btn=document.getElementById("createFolderBtn");

    btn.onclick=()=>{

        document.getElementById("folderModal").style.display="flex";

    };

}

function closeFolderModal(){

    document.getElementById("folderModal").style.display="none";

}

async function loadFolders(){

    const res=await fetch("/api/folders");

    const data=await res.json();

    const grid=document.getElementById("folderGrid");

    grid.innerHTML="";

    if(data.folders.length===0){

        grid.innerHTML=`

        <div class="empty">

        <h3>No folders</h3>

        </div>

        `;

        return;

    }

    data.folders.forEach(folder=>{


        grid.innerHTML+=`

        <div class="folder-card" onclick="openFolder('${folder._id}')">

            <div class="folder-icon">
            📁
            </div>


            <h3>
            ${folder.name}
            </h3>

        </div>

        `;

    });


}

async function createFolder(){

    const name=document.getElementById("folderName").value;

    const res=await fetch("/api/folders/create",{

        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name})

    });

    const data=await res.json();

    if(data.success){

        alert("Folder Created");
        loadFolders();

    } else{

        alert(data.message);

    }

}



function formatStorage(bytes){

    if(bytes < 1024){
        return bytes + " Bytes";
    }

    if(bytes < 1024 * 1024){
        return (bytes / 1024).toFixed(2) + " KB";
    }

    if(bytes < 1024 * 1024 * 1024){
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";

}

function getFileName(name){
    const index = name.lastIndexOf(".");

    if(index === -1){

        return name;

    }
    return name.substring(0,index);

}

function getFileType(type){

    if(type.includes("pdf")){
        return "PDF";
    }

    if(type.includes("image")){
        return "IMAGE";
    }

    if(type.includes("video")){
        return "VIDEO";
    }

    if(type.includes("word")){
        return "WORD";
    }

    if(type.includes("excel") || type.includes("spreadsheet")){
        return "EXCEL";
    }

    if(type.includes("zip") || type.includes("compressed")){
        return "ZIP";
    }

    if(type.includes("text")){
        return "TEXT";
    }

    return "FILE";

}

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleString("en-IN",{

        day:"2-digit",

        month:"short",

        year:"numeric",

        hour:"2-digit",

        minute:"2-digit",

        hour12:true

    });

}

function getIcon(type = ""){

    type = type.toLowerCase();

    if(type.includes("image")) return "🖼";

    if(type.includes("pdf")) return "📄";

    if(type.includes("video")) return "🎥";

    if(type.includes("word") || type.includes("document")) return "📝";

    if(type.includes("excel") || type.includes("spreadsheet")) return "📊";

    if(type.includes("powerpoint") || type.includes("presentation")) return "📽";

    if(type.includes("zip") || type.includes("compressed")) return "🗜";

    if(type.includes("text")) return "📃";

    if(type.includes("audio")) return "🎵";

    return "📦";

}

// function getIcon(type){

//     let icon = "unknown.svg";

//     if(type.includes("image")){

//         icon = "image.svg";

//     }

//     else if(type.includes("pdf")){

//         icon = "pdf.svg";

//     }

//     else if(type.includes("video")){

//         icon = "video.svg";

//     }

//     else if(type.includes("word")){

//         icon = "word.svg";

//     }

//     else if(type.includes("excel") || type.includes("spreadsheet")){

//         icon = "excel.svg";

//     }

//     else if(type.includes("zip") || type.includes("compressed")){

//         icon = "zip.svg";

//     }

//     else if(type.includes("text")){

//         icon = "text.svg";

//     }

//     return `<img src="/icons/${icon}" class="file-icon">`;

// }

function formatSize(bytes){

    return (bytes/1024/1024).toFixed(2)+" MB";

}

function initializeUpload(){

    const uploadBtn=document.getElementById("uploadBtn");

    const fileInput=document.getElementById("fileInput");

    uploadBtn.addEventListener("click", () => {

        fileInput.click();

    });

    fileInput.onchange=()=>{

        if(fileInput.files.length>0){

            uploadSelectedFile(fileInput.files[0]);

        }

    }

}