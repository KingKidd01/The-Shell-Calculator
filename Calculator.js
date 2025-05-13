const terminal = document.getElementById('terminal');

function updateCursorPosition(editable, cursor) {
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        
        const tempSpan = document.createElement('span');
        tempSpan.textContent = '\u200b';
        range.insertNode(tempSpan);
        
        const rect = tempSpan.getBoundingClientRect();
        const parentRect = editable.getBoundingClientRect();
        
        cursor.style.left = (rect.left - parentRect.left) + 'px';
        cursor.style.top = (rect.top - parentRect.top + 18) + 'px';
        
        tempSpan.parentNode.removeChild(tempSpan);
    }
}

function createInputLine() {
    const line = document.createElement('div');
    line.className = 'line';
  
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.innerText = 'C:\\User:>> ';
  
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
  
    const editable = document.createElement('div');
    editable.className = 'content-editable';
    editable.contentEditable = true;
  
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
  
    inputWrapper.appendChild(editable);
    inputWrapper.appendChild(cursor);
  
    line.appendChild(prompt);
    line.appendChild(inputWrapper);
    terminal.appendChild(line); 
  
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    editable.innerHTML = '\u200b';
    
    editable.focus();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  
    editable.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            processInput(editable.innerText.trim(), line);
            editable.contentEditable = false;
            cursor.remove();
        }
    });
  
    editable.addEventListener('input', function () {
        updateCursorPosition(editable, cursor);
    });
  
    editable.addEventListener('click', function () {
        updateCursorPosition(editable, cursor);
    });
  
    setTimeout(() => updateCursorPosition(editable, cursor), 0);
    terminal.scrollTop = terminal.scrollHeight;
}

terminal.addEventListener('click', function (e) {
    // Find the last input line's editable div
    const allEditables = terminal.querySelectorAll('.content-editable');
    const lastEditable = allEditables[allEditables.length - 1];

    if (lastEditable) {
        lastEditable.focus();

        // Move cursor to end of the content
        const range = document.createRange();
        range.selectNodeContents(lastEditable);
        range.collapse(false); // move to end
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
});



function processInput(input, previousLine) {
    if (!input) {
        createInputLine();
        return;
    }

    // get rid of all blank spaces
    input = input.replace(/\u200b/g, '').trim();

    if (input == "clear") {
        // 0 is the Title, remove all elements inside the terminal
        for (var i = 0; i < terminal.children.length; i++) {
            if (i == 0) {
                continue;
            } else {
                terminal.children[i].remove();
            }
        }
        
        // check extra elements "output-text", and delete them.
        var elements = Array.from(document.getElementsByClassName("output-text"));
        console.log(elements);
        for (child of elements) {
            child.remove();
        }
        
        createInputLine(); // create new line
        terminal.scrollTop = terminal.scrollHeight;

        return;
    }
    
    //print out a helpful list of commands
    if (input == "cmds") {
        const output = document.createElement('div');
        output.className = 'output-text';
        output.style.marginLeft = '20px';
    

        output.innerText = `Credits to Hayden G. \n cmds: clear -> removes all previous inputs/outputs.`;
        output.style.color = '#00FF00';


        terminal.appendChild(output);

        createInputLine();
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }




    const output = document.createElement('div');
    output.className = 'output-text';
    output.style.marginLeft = '20px';

    try {
        const result = eval(input);
        output.innerText = `= ${result}`;
        output.style.color = '#00FF00';
    } catch (error) {
        output.innerText = `Error: ${error.message}`;
        output.style.color = '#FF0000';
    }

    terminal.appendChild(output);
    createInputLine();
    terminal.scrollTop = terminal.scrollHeight;
}

function createStars(amount) {



    for (let i = 0; i < amount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';

      
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';

        star.style.animationDelay = Math.random() * 5 + 's';

        terminal.appendChild(star);
    }   
}
    

createStars(100);


createInputLine();
