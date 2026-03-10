import { promises as fs } from 'fs';
import * as readline from 'readline';

function findFirstAndLastDigit( pInput: string ): { first?: number, last?: number, result_nr: number; } 
{
    let firstIndex: number | undefined = undefined;

    let lastIndex: number | undefined = undefined;

    for ( let cur_index = 0; ( cur_index < pInput.length ) && ( firstIndex === undefined ); cur_index++ ) 
    {
        const cur_char = pInput[ cur_index ];

        if ( cur_char !== undefined ) 
        {
            if ( cur_char >= '0' && cur_char <= '9' ) 
            {
                firstIndex = cur_index;
            }
        }
    }

    for ( let cur_index = ( pInput.length - 1 ); ( cur_index >= 0 ) && ( lastIndex === undefined ); cur_index-- ) 
    {
        const cur_char = pInput[ cur_index ];

        if ( cur_char !== undefined ) 
        {
            if ( cur_char >= '0' && cur_char <= '9' ) 
            {
                lastIndex = cur_index;
            }
        }
    }

    const result: { first?: number, last?: number, result_nr: number; } = { result_nr: 0 };

    if ( firstIndex !== undefined ) 
    {
        result.first = Number( pInput[ firstIndex ] );

        result.result_nr = result.first;
    }

    if ( lastIndex !== undefined ) 
    {
        result.last = Number( pInput[ lastIndex ] );

        result.result_nr = ( result.result_nr * 10 ) + result.last;
    }

    return result;
}

function replaceWordDigits( input: string ): string {
    
    const replacements: { word: string; digit: string; }[] = [

        { word: "eightwone",     digit: "821" },
        { word: "eightwo",       digit: "82" },

        { word: "eighthreeight", digit: "838" },
        { word: "eighthree",     digit: "83" },

        { word: "twone",         digit: "21" },

        { word: "oneight",       digit: "18" },
        { word: "threeight",     digit: "38" },
        { word: "fiveight",      digit: "58" },
        { word: "nineight",      digit: "98" },

        { word: "sevenine",      digit: "79" },

        { word: "one",           digit: "1" },
        { word: "two",           digit: "2" },
        { word: "three",         digit: "3" },
        { word: "four",          digit: "4" },
        { word: "five",          digit: "5" },
        { word: "six",           digit: "6" },
        { word: "seven",         digit: "7" },
        { word: "eight",         digit: "8" },
        { word: "nine",          digit: "9" },
    ];

    let result = input.toLowerCase();

    for ( const cur_replacement of replacements ) 
    {
        result = result.split( cur_replacement.word ).join( cur_replacement.digit );
    }

    return result;
}

function calcPart02( pArray: string[] ): void {

    let result_part_01: number = 0;

    let result_part_02: number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let result_obj = findFirstAndLastDigit( cur_input_str );

        result_part_01 += result_obj.result_nr;

        let repl_word = replaceWordDigits( cur_input_str );

        result_obj = findFirstAndLastDigit( repl_word );

        result_part_02 += result_obj.result_nr;

        console.log( cur_input_str + " - " + repl_word + " - " + result_obj.result_nr );
    }

    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day01_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}

function checkReaddatei(): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcPart02( arrFromFile );
    } )();

}

//const arr: string[] = [ "1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet" ];

const arr: string[] = [ "two1nine", "eightwothree", "abcone2threexyz", "xtwone3four", "4nineeightseven2", "zoneight234", "7pqrstsixteen" ];

calcPart02( arr );

checkReaddatei();
