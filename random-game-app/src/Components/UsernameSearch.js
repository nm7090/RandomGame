import { useState } from 'react';

function UsernameSearch() {

    const [userInput, setUserInput] = useState('');
    const [userDisplay, setUserDisplay] = useState('');
    const [username, setUserName] = useState('')
    const [numGames, setNumGames] = useState('')
    const [gameNames, setGameNames] = useState([])
    const [gameItems, setGameItems] = useState([])
    const [gameDisplayContent, setGameDisplayContent] = useState([])
    const [bestWithPlayersInput, setBestWithPlayersInput] = useState("")

    const parser = new DOMParser();

    const changeInput = (event) => {
        setUserInput(event.target.value)
    }

    const changeBestWithInput = (event) => {
        setBestWithPlayersInput(event.target.value)
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
                setGameItems(items)

                var names = []

                for (let i = 0; i < items.length; i++) {
                    var item = items[i]
                    if(item.nodeType !== Node.TEXT_NODE){
                        console.log(item.getElementsByTagName("name")[0].textContent) //This line works and provides name
                        var name = item.getElementsByTagName("name")[0].textContent
                        var id = item.getAttribute("objectid")
                        names.push({"name": name, "id": id})
                    }
                    
                }

                console.log(names)
                setGameNames(names)
                
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const grabRecommendedGamesByBestPlayers = (numPlayers) => {
        var bestNumPlayersGames = []
        for(var i = 0; i < gameNames.length; i++) {
            var id = gameNames[i]["id"]
            var url = `https://boardgamegeek.com/xmlapi/boardgame/${id}`

            fetch(url)
            .then((response) => response.text())
            .then((text) => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(text, "text/xml")
                var pollSummaries = doc.documentElement.getElementsByTagName("poll-summary")
                for(var j = 0; j < pollSummaries.length; k++){
                    if(pollSummaries[j].getAttribute("name") === "suggested_numplayers"){
                        var results = pollSummaries.getElementsByTagName("result")
                        for(var k = 0; k < results.length; k++){
                            if(results[k].getAttribute("name") === "bestwith") {
                                if(results[k].getAttribute("value").text.includes(numPlayers)) {
                                    bestNumPlayersGames.push(gameNames[i])
                                }
                            }
                        }
                    }
                }
            })
        }

        setGameDisplayContent(bestNumPlayersGames)
    }

    const displayAllGames = () => {

        setGameDisplayContent(gameNames)
    }

    const displayUser = () => {
        setUserDisplay( "Welcome " + userInput + "!")
        setUserName(userInput)
        grabOwnedGames()
    }

    return(
        <div>
            <input id="userSearch" type="text" placeholder='Username' onChange={changeInput}/>

            <button onClick={displayUser}>Login</button>

            <p id="username">{userDisplay}</p>

            <div>
                <h2>Owned Games</h2>
                <button onClick={grabOwnedGames}>Load Owned Games</button>
                <p>Total Owned Games: {numGames}</p>
                <button onClick={displayAllGames}>Show All Loaded Games</button>
            </div>

            <div>
                <h2>Get Games by Best With Players</h2>
                <input type='text' placeholder='Best With Players' onChange={setBestWithPlayersInput}/>
                <button onClick={() => {grabRecommendedGamesByBestPlayers(bestWithPlayersInput)}}>Search</button>
            </div>

            <ol>
                {gameDisplayContent.length !== 0 ? gameDisplayContent.map((value) => {
                    return(
                        <li>{value["name"]}, {value["id"]}</li>
                    )
                }) : <p></p>}
            </ol>
        </div>
    )
}

export default UsernameSearch;