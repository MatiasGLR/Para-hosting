document.querySelector("#unlog").addEventListener("click", (e)=>{
   document.cookie = "kye=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
   document.location.href = "/login";
});