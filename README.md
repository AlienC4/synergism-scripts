# synergism-scripts
This is a repository for various scripts and helper functions for the game Synergism

### Installation
To install the scripts with Tampermonkey,
1. Make sure you have Tampermonkey installed
2. Click on the script you want to install
3. Click Raw. A new tab should open
4. Click Install

If you don't want to use Tampermonkey, you can simply copy paste the contents of 
the file into the console.  
If you're playing on Kongregate, the easiest way to get the scripts to work is to switch to 
[Github](https://pseudonian.github.io/SynergismOfficial/). If that is not an option due using the chat or some other 
reason, open the dev tools (usually by pressing F12) and select console, click on this button at the top right of the 
dev tools if you're on Firefox:  
![](images/Firefox%20iframe.png "Firefox IFrame selector")  
Or if you're on Chrome, click on the arrow to the right of "top" and scroll down until you find the gameiframe  
![](images/Chrome%20iframe.png "Chrome IFrame selector")  

Alternatively, you can right click anywhere in the game and select "Inspect Element" and then select Console. 

After getting the console open, paste the script you want to use in the console and press Enter.

### Individual scripts
#### maximize5x10AndOpen
##### Usage:  
`maximize5x10AndOpen()`: Calls the function with the default parameters (`ascTimeMulti = 0`, `weights = blessingWeights`). 
This is likely what you'd normally want to use.  
`maximize5x10AndOpen(1)`: Includes the cubes from the current run in the calculation  
`maximize5x10AndOpen(2)`: Includes the cubes from the current run, assuming the run will be twice as long as it 
currently is.

##### Parameters  
`ascTimeMulti`:  
- 0 to calculate using current cubes (default),  
- 1 to calculate using current cubes + cubes from current run  
- \>1 to multiply the cubes from the current run, as if you ran it longer  

`weights`:  
No need to really change this one, change the individual elements in `blessingWeights` instead


#### R8x25LevelLogger
##### Usage: 
Just install the script by following the installation instructions
##### Function: 
The script will log the current rate of levels gained whenever you gain additional levels (and only then)

#### CubesPerSecDisplay
##### Usage: 
Install the script by following the instructions
##### Function:
It will log the stats from the current run to the console when you Ascend.
The display at the top of the screen this script used to provide is currently disabled as the built in one is prettier 
and has more functionality.