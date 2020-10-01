function redirectToSumbit() {
     window.location = '/create'
}

function redirectToHome() {
     window.location = '/'
}

async function redirectToBin(valu) {
     const val = parseInt(valu)
     let fetched = await fetch('/info/bin/currentID')
     let data = await fetched.json()
     if (!isNaN(val) && val >= 1000 && val <= data.currentID) {
          return window.location = `/bin/${valu}`
     } else {
          return window.alert('Invaild Code')
     }

}

async function createBin() {
     let code = getElement('id', 'BinCode', true).value;
     if (code.split(' ').length <= 5) {
          return window.alert('Please have at least 5 words!')
     }
     const options = {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify({
               text: code
          })
     }
     await fetch('/create', options)
     console.log('Done Creating')

     let fetched = await fetch('/info/bin/currentID')
     let data = await fetched.json()
     window.location = `/bin/${data.currentID}`
}