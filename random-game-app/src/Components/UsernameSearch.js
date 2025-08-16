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
    const [generatedGamesNum, setGeneratedGamesNum] = useState("")
    const [buttonActivation, setButtonActivation] = useState(true)

    const parser = new DOMParser();

    const changeInput = (event) => {
        setUserInput(event.target.value)
    }

    const changeBestWithInput = (event) => {
        setBestWithPlayersInput(event.target.value)
    }

    const changeNumberGamesWithInput = (event) => {
        setGeneratedGamesNum(event.target.value)
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

    const grabRecommendedGamesByMinMaxPlayers = (numPlayers, numGames) => {
        var names = []
        for (let i = 0; i < gameItems.length; i++) {
            var item = gameItems[i]
            if(item.nodeType !== Node.TEXT_NODE){
                var stats = item.getElementsByTagName("stats")[0]
                var minPlayers = stats.getAttribute("minplayers")
                var maxPlayers = stats.getAttribute("maxplayers")
                if(parseInt(minPlayers) <= parseInt(numPlayers) && parseInt(maxPlayers) >= parseInt(numPlayers)){
                    var name = item.getElementsByTagName("name")[0].textContent
                    var id = item.getAttribute("objectid")
                    names.push({"name": name, "id": id})
                }
            }
            
        }

        var displayedGames = []

        for(var i = 0; i < numGames; i++){
            if(names.length === 0){
                break
            }
            var random = Math.floor(Math.random() * (names.length - 1))
            displayedGames.push(names[random])
            names.splice(random, 1)
        }
        setGameDisplayContent(displayedGames)
    }

    const displayAllGames = () => {

        setGameDisplayContent(gameNames)
    }

    const displayUser = () => {
        setUserDisplay( "Welcome " + userInput + "!")
        setUserName(userInput)
        grabOwnedGames()
        setButtonActivation(false)
    }

    return(
        <div>

            <ol style={{"float": "right", "width": "750px"}}>
                {gameDisplayContent.length !== 0 ? gameDisplayContent.map((value) => {
                    return(
                        <li>{value["name"]}, {value["id"]}</li>
                    )
                }) : <p></p>}
            </ol>

            <input id="userSearch" type="text" placeholder='Username' onChange={changeInput}/>

            <button onClick={displayUser}>Login</button>

            <p id="username">{userDisplay}</p>

            <div>
                <h2>Owned Games</h2>
                <button onClick={grabOwnedGames} disabled={buttonActivation}>Load Owned Games</button>
                <p>Total Owned Games: {numGames}</p>
                <button onClick={displayAllGames} disabled={buttonActivation}>Show All Loaded Games</button>
            </div>

            <div>
                <h2>Generation Settings</h2>
                <label for="numGenerate">Number of Generated Games: </label>
                <input name='numGenerate' type='number' defaultValue={10} onChange={changeNumberGamesWithInput}/>
            </div>

            <div>
                <h2>Get Games by Amount of Players</h2>
                <input type='number' placeholder='Best With Players' onChange={changeBestWithInput}/>
                <button onClick={() => {grabRecommendedGamesByMinMaxPlayers(bestWithPlayersInput, generatedGamesNum)}} disabled={buttonActivation}>Search</button>
            </div>
        </div>
    )
}

export default UsernameSearch;