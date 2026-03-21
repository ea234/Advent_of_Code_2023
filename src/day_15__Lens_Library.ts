import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/15
 * 
 * https://www.reddit.com/r/adventofcode/comments/18isayp/2023_day_15_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day15/day_15__Lens_Library.js
 * 
 *    0 Character H =   72  200
 *    1 Character A =   65  153
 *    2 Character S =   83  172
 *    3 Character H =   72   52
 * 
 * Day 15 - Lens Library
 * cmd nr     0 = Label rn=1        Hash/Box   30
 * cmd nr     1 = Label cm-         Hash/Box  253
 * cmd nr     2 = Label qp=3        Hash/Box   97
 * cmd nr     3 = Label cm=2        Hash/Box   47
 * cmd nr     4 = Label qp-         Hash/Box   14
 * cmd nr     5 = Label pc=4        Hash/Box  180
 * cmd nr     6 = Label ot=9        Hash/Box    9
 * cmd nr     7 = Label ab=5        Hash/Box  197
 * cmd nr     8 = Label pc-         Hash/Box   48
 * cmd nr     9 = Label pc=6        Hash/Box  214
 * cmd nr    10 = Label ot=7        Hash/Box  231
 * 
 * cmd nr     0 = Label rn    CMD = Hash/Box    0
 * cmd nr     1 = Label cm    CMD - Hash/Box    0
 * cmd nr     2 = Label qp    CMD = Hash/Box    1
 * cmd nr     3 = Label cm    CMD = Hash/Box    0
 * cmd nr     4 = Label qp    CMD - Hash/Box    1
 * cmd nr     5 = Label pc    CMD = Hash/Box    3
 * cmd nr     6 = Label ot    CMD = Hash/Box    3
 * cmd nr     7 = Label ab    CMD = Hash/Box    3
 * cmd nr     8 = Label pc    CMD - Hash/Box    3
 * cmd nr     9 = Label pc    CMD = Hash/Box    3
 * cmd nr    10 = Label ot    CMD = Hash/Box    3
 * 
 * Box Nr 0 [rn 1] [cm 2] 
 * Box Nr 3 [ot 7] [ab 5] [pc 6] 
 * 
 * rn    :   1 *   1 *  1 =     1
 * cm    :   1 *   2 *  2 =     4
 * ot    :   4 *   1 *  7 =    28
 * ab    :   4 *   2 *  5 =    40
 * pc    :   4 *   3 *  6 =    72
 * 
 * Result Part 1 = 1320
 * Result Part 2 = 145
 */

class Lens
{
    m_label        : string = "";

    m_focal_length : number = 0;

    constructor ( pLabel : string, pFocalLength : number )
    {
        this.m_label = pLabel;

        this.m_focal_length = pFocalLength; 
    }

    public getLabel() : string
    {
        return this.m_label;
    }

    public isLabel( pLabel : string ) : boolean
    {
        return this.m_label === pLabel;
    }

    public getFocalLength() : number
    {
        return this.m_focal_length;
    }

    public setFocalLength( pFocalLength : number ) : void 
    {
        this.m_focal_length = pFocalLength;
    }

    public toString() : string 
    { 
        return this.m_label + " " + this.m_focal_length;
    }
}


class LightBox
{
    m_box_nr      : number;

    m_lens_array  : Lens[] = [];

    constructor( pBoxNr : number )
    {
        this.m_box_nr = pBoxNr;
    }

    public getBoxNr() : number
    {
        return this.m_box_nr;
    }

    public hasLens() : boolean
    {
        return this.m_lens_array.length > 0;
    }

    public getLensCount() : number
    {
        return this.m_lens_array.length;
    }

    public getLensArray() : Lens[]
    {
        return this.m_lens_array;
    }

    public getLensIndex( pLabel : string ) : number 
    {
        for ( let i = 0; i < this.m_lens_array.length; i++ )
        {
            if ( this.m_lens_array[i]!.isLabel( pLabel ) )
            {
                return i;
            }
        }

        return -1;
    }
    
    public remove( pLabel : string ) : void
    {
        let index_inst : number = this.getLensIndex( pLabel );

        if ( index_inst >= 0 )
        {
            this.m_lens_array.splice( index_inst, 1 );
        }
    }

    public add( pLabel : string, pFocalLenght : string ) : void
    {
        let index_inst : number = this.getLensIndex( pLabel );

        let focal_length : number = parseInt( pFocalLenght, 10 );

        if ( index_inst >= 0 )
        {
            this.m_lens_array[ index_inst ]?.setFocalLength( focal_length );
        }
        else
        {
            this.m_lens_array.push( new Lens( pLabel, focal_length ) );
        }
    }

    private getLensString() : string 
    {
        let str_result : string  = "";

        for ( let lens_inst of this.m_lens_array )
        {
            str_result += "[" + lens_inst.toString() + "] ";
        }

        return str_result;
    }

    public toString() : string 
    {
        return pad( this.m_box_nr , 3 ) + " " + this.getLensString();
    }
}


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


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
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


function parseInput( pInput : string ) : { label : string; focal_length : string; command : string } 
{ 
    const trimmed_input = pInput.trim();

    const index_equals  = trimmed_input.indexOf( '=' ); 

    const index_dash    = trimmed_input.indexOf( '-' );

    let label        : string = "";

    let focal_length : string = "";

    let command      : string = "";

    if ( index_equals >= 0 ) 
    { 
        label        = trimmed_input.substring( 0, index_equals ); 
        
        focal_length = trimmed_input.substring( index_equals + 1 );

        command      = "=";
    }   
    else if ( index_dash >= 0 ) 
    { 
        label   = trimmed_input.substring( 0, index_dash ); 

        command = "-";
    }

    return { label: label, focal_length: focal_length, command: command };
}


function calcArray( pArray : string[] ): void {

    let result_part_01 : number = 0;

    let result_part_02 : number = 0;

    let input_string   : string = "";

    for ( const cur_input_str of pArray ) 
    {
        input_string += cur_input_str;
    }

    let ini_cmds : string[] = input_string.split( "," );

    /*
     * *******************************************************************************************************
     * Calculating Part 1 : Hash-Values
     * *******************************************************************************************************
     */

    for ( let index_cmd = 0; index_cmd < ini_cmds.length; index_cmd++ )
    {
        let cur_hash_value = getHash( ini_cmds[ index_cmd ]!, false );

        wl( "cmd nr " + pad( index_cmd, 5 ) + " = Label " + padR( ini_cmds[ index_cmd ]!, 11 ) + " Hash/Box " + pad( cur_hash_value, 4 ) );

        result_part_01 += cur_hash_value;
    }

    /*
     * *******************************************************************************************************
     * Doing the commands
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "" );

    let light_boxes : LightBox[] = [];

    for ( let box_nr : number = 0; box_nr < 256; box_nr++ )
    {
        light_boxes[ box_nr ] = new LightBox( box_nr );
    }

    for ( let index_cmd = 0; index_cmd < ini_cmds.length; index_cmd++ )
    {
        /*
         * Get label of the lens, Operator, focus-length
         */
        let cmd_inst = parseInput( ini_cmds[ index_cmd ]! );

        let hash_label = getHash( cmd_inst.label, false );

        if ( cmd_inst.command === "-" )
        {
            /*
             * Delimiter "-" = remove the Label
             */
            light_boxes[ hash_label ]!.remove( cmd_inst.label );
        }
        else if ( cmd_inst.command === "=" )
        {
            /*
             * Delimiter "=" = replace existing lens  OR  add lens
             */
            light_boxes[ hash_label ]!.add( cmd_inst.label, cmd_inst.focal_length );
        }

        wl( "cmd nr " + pad( index_cmd, 5 ) + " = Label " + padR(  cmd_inst.label, 5 ) + " CMD " + cmd_inst.command + " Hash/Box " + pad( hash_label, 4 ) );
    }

    wl( "" );

    for ( let box_nr = 0; box_nr < 256; box_nr++ )
    {
        if ( light_boxes[ box_nr ]!.hasLens() )
        {
            wl( "Box Nr " + pad( box_nr, 4 ) + " " + light_boxes[ box_nr ]!.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    wl( "" );

    for ( let box_nr = 0; box_nr < 256; box_nr++ )
    {
        if ( light_boxes[ box_nr ]!.hasLens() )
        {
            let lens_array : Lens[] = light_boxes[ box_nr ]!.getLensArray();

            for ( const [ index_lens, lens_inst ] of lens_array.entries() ) 
            {  
                /*
                 * One plus the box number of the lens in question. 
                 * 
                 * The slot number of the lens within the box: 1 for the first lens, 2 for the second lens, and so on.
                 * 
                 * The focal length of the lens.
                 */
                let focus_power : number = ( ( box_nr + 1 ) * ( index_lens + 1 ) ) * lens_inst.getFocalLength();

                result_part_02 += focus_power;

                wl(  padR( lens_inst.getLabel(), 6 ) + ": " + pad( "" + ( box_nr + 1 ), 3 )  + " * " + pad( ( index_lens + 1 ), 3 ) + " * " + pad( "" + lens_inst.getFocalLength(), 2 ) + " =" + pad( focus_power, 6 ) );
            }            
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day15_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
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

// let hash_val = getHash( "HASH", true );
// wl( "hash_value " + hash_val );

calcArray( arr_test_1 );

//checkReaddatei();
