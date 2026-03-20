import { promises as fs } from 'fs';
import * as readline from 'readline';


function wl( pString : string )
{
    console.log( pString );
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function getHash( pString : string , pKnzDebug : boolean ) : number 
{
    /*
     * start with a current value of 0.
     */
    let current_value : number = 0;

    for ( let cur_index = 0; cur_index < pString.length; cur_index++ ) 
    {
        /*
         * Determine the ASCII code for the current character of the string.
         */
        let current_character   : string = pString[ cur_index ] ?? ".";

        let cur_char_ascii_code : number = current_character.charCodeAt(0);

        /*
         * Increase the current value by the ASCII code you just determined.
         */
        current_value += cur_char_ascii_code;

        /*
         * Set the current value to itself multiplied by 17.
         */
        current_value = current_value * 17;

        /*
         * Set the current value to the remainder of dividing itself by 256.
         */
        current_value = current_value % 256;

        if ( pKnzDebug )
        {
            wl( pad( cur_index, 4 ) + " Character " + current_character + " = " + pad( cur_char_ascii_code, 4 ) + " " + pad( current_value, 4 ) );
        }
    }

    return current_value;
}

function calcArray( pArray: string[] ): void {

    let result_part_01: number = 0;

    let result_part_02: number = 0;

    let input_string : string = "";

    for ( const cur_input_str of pArray ) 
    {
        input_string += cur_input_str;
    }

    let ini_cmds : string[] = input_string.split(",");

    for ( let index_cmd = 0; index_cmd < ini_cmds.length; index_cmd++ )
    {
        let cur_hash_value = getHash( ini_cmds[ index_cmd ]!, false );

        wl( " " + ini_cmds[ index_cmd ]! + " hash " +  cur_hash_value );

        result_part_01 += cur_hash_value;
    }

    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day15_input.txt";

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

        calcArray( arrFromFile );
    } )();

}

wl( "Day 15 - Lens Library" );

const arr_test_1: string[] = [ "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7" ];

//let hash_val = getHash( "HASH", true );
//console.log( "hash_value " + hash_val );

//calcArray( arr_test_1 );

checkReaddatei();
