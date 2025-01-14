import { useState } from 'react';

function UsernameSearch() {

    const [userInput, setUserInput] = useState('');
    const [userDisplay, setUserDisplay] = useState('');

    const changeInput = (event) => {
        setUserInput(event.target.value)
    }

    const displayUser = () => {
        setUserDisplay( "Welcome " + userInput + "!")
    }

    return(
        <div>
            <input id="userSearch" type="text" onChange={changeInput}/>

            <button onClick={displayUser}>Press Me!</button>

            <p id="username">{userDisplay}</p>
        </div>
    )
}

export default UsernameSearch;