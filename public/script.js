const form = document.querySelector("form");
const searchinput = document.querySelector(".searchinput");
const divData = document.querySelector(".Data");
const MainData = document.querySelector(".MainData");
const Loading_Page = document.querySelector(".Loading_Page");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (searchinput.value.trim() === "") {
    alert("Please Enter Something To Search");
    return;
  } else {
    try {
      divData.innerText = "";
      Loading_Page.style.display = "block";
      MainData.style.display = "none";
      let Value = searchinput.value.trim();
      console.log(`Getting value from frontend ${Value}`);
      const data = { Value };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const response = await fetch("/api", options);
      if (!response.ok) throw "Could Not Fetch Data___Try Again";
      else {
        const json = await response.json();
        // console.log("THIS IS JSON", json);
        MainData.style.display = "block";
        Loading_Page.style.display = "none";
        if (json.status === "FAILED") throw "Data Not Found___Try Again";
        else if (json.status === "SUCCESS") {
          let All_QnA = json.QnA;
          // console.log(All_QnA);
          All_QnA.forEach((element) => {
            divData.innerHTML += `
          <div class="QnA">
          <div class="Question">
          <span class="QA_heading">Question : ${element.id}</span><br>${element.Question}</div>
          <br>
          <div class="Answer">
          <span class="QA_heading">Answer:</span><br>${element.Answer}</div>
          </div>`;
          });
        } else {
          throw "Something Went Wrong";
        }
      }
    } catch (error) {
      // console.log(error);
      Loading_Page.style.display = "none";
      MainData.style.display = "block";
      divData.innerHTML = `
      <div class="QnA">
      <p>An Error Occured.</p>
      <p>Error :: ${error}</p>
    </div>
    `;
    }
  }
});
