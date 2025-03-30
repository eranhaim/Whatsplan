//fetch user details and settings
// try{
//     const fetchedUser = await fetch(`http://localhost:100/getUser/${UrlParams[UrlParams.length - 1]}`);
//     setUser(fetchedUser);

//     console.log(fetchedUser)

//     const fetchedQR = await fetch(`http://localhost:100/startOrLoadSession/${fetchedUser._id}`);
//     setQrCode(fetchedQR.qr);
// } catch(err){
//     console.log(err)
// }