window.onload = async() => {
  const email = sessionStorage.getItem("email"); // 이메일 정보 가져와서 저장
  if(email){
    document.getElementById("loginSpan").innerHTML = email + ` <button id = "logout">logout</button>`;
  }
  
  
  axios.defaults.withCredentials = true; // axios에 credential설정
  console.log(axios);
// 서버에서 데이터 가져와서
let productList = await fetch("http://localhost:8080/getAllProducts", {method: "GET"});
console.log(productList); // text 형태

// text를 다시 배열로
productList = await productList.json();
console.log(productList); // 배열 형태


// 이 형식으로 가공해서
let productListDiv = ``;
productList.forEach((item) => {
  productListDiv += `<div class="card m-3" style="width: 10rem;">
                <img src="img/${item.pimg}" class="card-img-top" alt="...">
                <div class="card-body">
                  <b class="card-title">${item.prodname}</b>
                  <p class="card-text text-danger">${item.price}</p>
                  <a href="#" class="btn btn-outline-info" id="addCart">장바구니 담기</a>
                </div>
              </div>`;
});


// 여기에 갖다 붙인다
document.getElementById("productListDiv").innerHTML = productListDiv;
}

// 회원가입
document.getElementById("signupBtn").addEventListener("click", async () => {
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const data = { nickname, email, pwd }; // js 객체화
  let response = await fetch("http://localhost:8080/insertMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  console.log(response);
  if (response.msg === "ok") {
    console.log("ok");
    const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
    modal.hide();
    //hero icons
//     document.getElementById("loginSpan").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="24" height="24">
//   <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
// </svg>`;
    document.getElementById("signupLi").remove();
  } else{
    alert(response.msg);
  }
});

// 로그인
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const pwd = document.getElementById("loginPwd").value;
  const data = { email, pwd }; // js 객체화

  // fetcch -> axios.post
  let response = await axios.post("http://localhost:8080/login", data);
  
  
  // response = await response.json(); json형태 변환 안해도 됨
  console.log(response);
  alert(response.data.msg);
  if(response.data.msg == "ok"){
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    modal.hide();

    document.getElementById("loginSpan").innerHTML = email + ` <button id = "logout">logout</button>`;

    window.sessionStorage.setItem("email", email);
  }

});

// 장바구니버튼 누르면 콜백함수 수행되도록
document.getElementById("productListDiv").addEventListener("click", (event)=>{
 if(event.target.id == 'addCart'){
  axios.post("http://127.0.0.1:8080/addCart", {});
 }
});

// 로그아웃동작
document.getElementById("loginSpan").addEventListener("click", (event)=>{
  if(event.target.id == 'logout'){
    sessionStorage.removeItem("email"); // 섹션스토리지에서 지우기
    window.location.reload(); // 화면 갱신
   }
});