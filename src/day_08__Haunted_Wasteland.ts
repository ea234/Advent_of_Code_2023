import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/8
 *
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day08/day_08__Haunted_Wasteland.js
 * Day 08 - Haunted Wasteland
 * 
 * lr_rule RL
 * 
 *   AAA  L BBB   R CCC
 *   BBB  L DDD   R EEE
 *   CCC  L ZZZ   R GGG
 *   DDD  L DDD   R DDD
 *   EEE  L EEE   R EEE
 *   GGG  L GGG   R GGG
 *   ZZZ  L ZZZ   R ZZZ
 * 
 * From AAA R To CCC  steps 1
 * From CCC L To ZZZ  steps 2
 * 
 * Result Part 1 = 2
 * Result Part 2 = 0
 * 
 * -----------------------------------
 * 
 * lr_rule LLR
 * 
 *   AAA  L BBB   R BBB
 *   BBB  L AAA   R ZZZ
 *   ZZZ  L ZZZ   R ZZZ
 * 
 * From AAA L To BBB  steps 1
 * From BBB L To AAA  steps 2
 * From AAA R To BBB  steps 3
 * From BBB L To AAA  steps 4
 * From AAA L To BBB  steps 5
 * From BBB R To ZZZ  steps 6
 * 
 * Result Part 1 = 6
 * Result Part 2 = 0
 * 
 */

class MapNode 
{
    m_node_name  : string;
    m_node_left  : string;
    m_node_right : string;

    constructor ( pInput : string )
    {
        const [ name, left, right ] = pInput.toUpperCase().replace( /[=(),]/g, " " ).trim().split( /\s+/ );

        this.m_node_name = name!;
        this.m_node_left = left!;
        this.m_node_right = right!;
    }

    public getNodeName() : string 
    {
        return this.m_node_name;
    }

    public getNodeLeft() : string 
    {
        return this.m_node_left;
    }

    public getNodeRight() : string 
    {
        return this.m_node_right;
    }

    public getStepDirectionNode( pString : string ) : string 
    {
        return ( pString === "R" ) ? this.m_node_right : this.m_node_left;
    }

    public checkNameEndsWithZ(): boolean
    {
        return ( this.m_node_name[2] === "Z" );
    }

    public checkNameEndsWithA(): boolean
    {
        return ( this.m_node_name[2] === "A" );
    }

    public toString() : string 
    {
        return "Node " + this.m_node_name + "  L " + this.m_node_left + "   R " + this.m_node_right ;
    }
}


function calcArray( pArray: string[], knz_calc_p1 : boolean  ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the array
     * *******************************************************************************************************
     */
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    let lr_rule : string = "";

    let array_map_nodes : Record< string, MapNode > = {};

    let array_map_nodes_a : MapNode[] = [];

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            if ( lr_rule === "" )
            {
                lr_rule = cur_input_str.trim();
            }
            else
            {
                let map_node = new MapNode( cur_input_str );

                array_map_nodes[ map_node.getNodeName() ] = map_node;

                if ( map_node.checkNameEndsWithA() )
                {
                    //if ( map_node.getNodeName() !== "AAA" )
                    if ( array_map_nodes_a.length < 3 )
                    {
                        array_map_nodes_a.push( map_node );
                    }
                }
            }
        }

        console.log( cur_input_str );
    }

    /*
     * *******************************************************************************************************
     * Doing some debug stuff
     * *******************************************************************************************************
     */

    let knz_debug : boolean = true;

    if ( knz_debug )
    {
        console.log( "" );
        console.log( "lr_rule " + lr_rule );
        console.log( "" );

        Object.values(array_map_nodes).forEach((node) => {

            console.log( node.toString());
            
        });

        console.log( "" );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    if ( knz_calc_p1 )
    {
        let cur_map_node : MapNode = array_map_nodes[ "AAA" ]!;

        let cur_lr_index : number = 0;

        let step_count   : number = 0;

        let step_dir     : string = lr_rule[ cur_lr_index ]!;

        while ( ( cur_map_node.getNodeName() !== "ZZZ" ) && ( step_count < 10_000_000 ) )
        {
            let next_node_id = cur_map_node.getStepDirectionNode( step_dir );

            step_count++;

            console.log( "From " + cur_map_node.getNodeName() + " " + step_dir + " To " + next_node_id + "  steps " + step_count );

            cur_map_node = array_map_nodes[ next_node_id ]!;

            cur_lr_index++;

            if ( cur_lr_index >= lr_rule.length )
            {
                cur_lr_index = 0;
            }

            step_dir = lr_rule[ cur_lr_index ]!;
        }

        result_part_01 = step_count;
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );


    console.log( "" );
    console.log( "a " + array_map_nodes_a.length );

    Object.values(array_map_nodes_a).forEach((node) => {

        console.log( "" );
        console.log( node.toString());
        
    });

    console.log( "" );
    console.log( "" );

    result_part_02 = calcStepsEndsWithZ( array_map_nodes, lr_rule, array_map_nodes_a );

    console.log( "" );
    console.log( "" );

    console.log( "Result Part 2 = " + result_part_02 );

    Object.values(array_map_nodes_a).forEach((node) => {

        console.log( "" );
        console.log( node.toString());
        
    });

    /*
    592153 tl
    */
    console.log( "b" );
}


function calcStepsEndsWithZ( array_map_nodes : Record< string, MapNode >, lr_rule : string, map_nodes_a : MapNode[] ) : number
{
    let knz_all_on_z : boolean = false;

    let cur_lr_index : number = 0;

    let step_count   : number = 0;

    let step_dir     : string = lr_rule[ cur_lr_index ]!;

    while ( ( knz_all_on_z === false ) && ( step_count < 30_000_000 ) )
    {
        for ( let index_b = 0; index_b < map_nodes_a.length; index_b++ )
        {
            map_nodes_a[ index_b ] = array_map_nodes[ map_nodes_a[ index_b ]!.getStepDirectionNode( step_dir ) ]!;
        }

        step_count++;

        knz_all_on_z = true;

        for ( let index_b = 0; (index_b < map_nodes_a.length) && ( knz_all_on_z ); index_b++ )
        {
            if ( map_nodes_a[ index_b ]!.checkNameEndsWithZ() === false  )
            {
                knz_all_on_z = false;
            }
        }

        cur_lr_index++;

        if ( cur_lr_index >= lr_rule.length )
        {
            cur_lr_index = 0;
        }

        step_dir = lr_rule[ cur_lr_index ]!;
    }

    if ( knz_all_on_z )
    {
        console.log( " Start a " +  " steps " + step_count   )

        return step_count;

    }

    return Number.MAX_SAFE_INTEGER;
}

async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day08_input.txt";

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

        calcArray( arrFromFile, true );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "RL" );
    array_test.push( "" );
    array_test.push( "AAA = (BBB, CCC)" );
    array_test.push( "BBB = (DDD, EEE)" );
    array_test.push( "CCC = (ZZZ, GGG)" );
    array_test.push( "DDD = (DDD, DDD)" );
    array_test.push( "EEE = (EEE, EEE)" );
    array_test.push( "GGG = (GGG, GGG)" );
    array_test.push( "ZZZ = (ZZZ, ZZZ)" );

    return array_test;
}


function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "LLR" );
    array_test.push( "" );
    array_test.push( "AAA = (BBB, BBB)" );
    array_test.push( "BBB = (AAA, ZZZ)" );
    array_test.push( "ZZZ = (ZZZ, ZZZ)" );

    return array_test;
}


function getTestArray3(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "LR" );
    array_test.push( "" );
    array_test.push( "11A = (11B, XXX)" );
    array_test.push( "11B = (XXX, 11Z)" );
    array_test.push( "11Z = (11B, XXX)" );
    array_test.push( "22A = (22B, XXX)" );
    array_test.push( "22B = (22C, 22C)" );
    array_test.push( "22C = (22Z, 22Z)" );
    array_test.push( "22Z = (22B, 22B)" );
    array_test.push( "XXX = (XXX, XXX)" );

    return array_test;
}


console.log( "Day 08 - Haunted Wasteland" );

//calcArray( getTestArray1() );
//calcArray( getTestArray2() );

//calcArray( getTestArray3(), false );
checkReaddatei();
