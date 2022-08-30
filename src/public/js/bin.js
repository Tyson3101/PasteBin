function redirectToSumbit() {
  window.location = "/create";
}

function redirectToHome() {
  window.location = "/";
}

async function redirectToBin(valu) {
  return (window.location = `/bin/${valu}`);
}

async function createBin() {
  let code = getElement("id", "BinCode", true).value;
  let lengthStr = getElement("id", "BinCode", true).value.replace(/\n/g, " ");
  if (lengthStr.length <= 2) {
    return window.alert("Please have at least 5 words!");
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: code,
    }),
  };
  let fetched = await fetch("/create", options);
  console.log("Done Creating");
  let data = await fetched.json();
  window.location = `/bin/${data.binID}`;
}
