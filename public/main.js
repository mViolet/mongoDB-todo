const deleteBtn = document.querySelectorAll(".delete")
const todoItem = document.querySelectorAll(".todoItem span")

Array.from(deleteBtn).forEach(el => {
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach(item => {
    item.addEventListener('click', markComplete)
})

async function deleteTodo(){
    // alert("you clicked delete") //to test if the js file is working
    const todoText = this.parentNode.childNodes[1].innerText.trim() // 1 because space is at index 0
    // console.dir(todoText.length) //verifying that the todoText doesn't have funky space
    try {
        const response = await fetch('deleteTodo', { //request to server, route is deleteTodo. we will await the response
            method: 'delete', //it's going to be a delete request
            headers: {'Content-type': 'application/json'}, //we are sending json
            body: JSON.stringify({ //we also sending a request body
                'clickedText': todoText //it contains 
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload() //reload the page
    } catch(err) { console.log(error) }

}

async function markComplete(e) {
    const todoText = this.parentNode.childNodes[1].innerText.trim()
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'itemToMark': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) { console.log(err) }
}