const BASE_URL = "/api/files";

async function getFiles() {

    const res = await fetch(`${BASE_URL}/getFiles`, {

        method: "GET"

    });

    return await res.json();

}

// async function uploadFile(formData){

//     const res = await fetch(`${BASE_URL}/upload`,{

//         method:"POST",

//         body:formData

//     });

//     return await res.json();

// }

function uploadFile(file){

    return new Promise((resolve,reject)=>{

        const xhr = new XMLHttpRequest();

        const formData = new FormData();

        formData.append("file", file);

        // Show upload card
        document.getElementById("uploadProgressContainer").style.display = "block";
        document.getElementById("uploadFileName").innerText = file.name;
        document.getElementById("uploadPercent").innerText = "0%";
        document.getElementById("uploadProgress").style.width = "0%";

        xhr.open("POST", "/api/files/upload");

        xhr.upload.onprogress = (e)=>{

            if(e.lengthComputable){

                const percent = Math.round((e.loaded / e.total) * 100);

                document.getElementById("uploadPercent").innerText =
                    percent + "%";

                document.getElementById("uploadProgress").style.width =
                    percent + "%";
            }

        };

        xhr.onload = ()=>{

            document.getElementById("uploadPercent").innerHTML =
                "Completed ✅";

            document.getElementById("uploadProgress").style.width = "100%";

            setTimeout(()=>{

                document.getElementById("uploadProgressContainer").style.display = "none";

                document.getElementById("uploadProgress").style.width = "0%";

                document.getElementById("uploadPercent").innerText = "0%";

            },1000);

            resolve(JSON.parse(xhr.responseText));

        };

        xhr.onerror = ()=>{

            document.getElementById("uploadPercent").innerHTML =
                "Upload Failed ❌";

            reject("Upload Failed");

        };

        xhr.send(formData);

    });

}

async function deleteFile(id){

    const res = await fetch(`${BASE_URL}/${id}`,{

        method:"DELETE"

    });

    return await res.json();

}

async function renameFile(id,name){

    const res = await fetch(`${BASE_URL}/${id}`,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            fileName:name

        })

    });

    return await res.json();

}

