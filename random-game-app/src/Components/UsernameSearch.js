import { useState } from 'react';

function UsernameSearch() {

    const [userInput, setUserInput] = useState('');
    const [userDisplay, setUserDisplay] = useState('');
    const [username, setUserName] = useState('')
    const [numGames, setNumGames] = useState('')

    const parser = new DOMParser();

    const changeInput = (event) => {
        setUserInput(event.target.value)
    }

    const grabOwnedGames = () => {
        var url = `https://boardgamegeek.com/xmlapi/collection/${username}?own=1`
        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(text, "text/xml")
                setNumGames(doc.documentElement.getAttribute("totalitems"))
                console.log(numGames)
                var items = doc.documentElement.getElementsByTagName("item")

                for (let i = 0; i < items.length; i++) {
                    var item = items[i]
                    if(item.nodeType !== Node.TEXT_NODE){
                        var name = item.getAttributeNode("name")
                        console.log(items[i].getElementsByTagName("name")[0].textContent) //This line works and provides name
                    }
                    
                }
                
                
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const displayUser = () => {
        setUserDisplay( "Welcome " + userInput + "!")
        setUserName(userInput)
        grabOwnedGames()
    }

    return(
        <div>
            <input id="userSearch" type="text" onChange={changeInput}/>

            <button onClick={displayUser}>Press Me!!!</button>

            <p id="username">{userDisplay}</p>

            <div>
                <h2>Owned Games</h2>
                <button onClick={grabOwnedGames}>Load Owned Games</button>
                <p>Total Owned Games: {numGames}</p>
            </div>
        </div>
    )
}

export default UsernameSearch;