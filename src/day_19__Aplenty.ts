import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/19
 * 
 * 
 * 
 */


type RuleParsed = {
  item_field : string;   
  operator : "<" | ">" | "=" | null;
  item_number : number | null;
  id_workflow_next : string;  
};


function parseInput( pInput : string) : RuleParsed | null 
{
    let item_field = "";

    let operator: "<" | ">" | "=" | null = null;
    
    let item_number: number | null = null;

    let ref_id_workflow = "";

    const opperator_index = pInput.search( /[<>=]/ );

    const number_seperator = pInput.indexOf( ":" )

    if ( opperator_index !== -1 ) 
    {
        item_field = pInput.substring( 0, opperator_index );

        operator = pInput[ opperator_index ] as "<" | ">" | "=";

        let numStr = pInput.substring( opperator_index + 1, number_seperator );

        item_number = numStr.length > 0 ? Number(numStr) : null;

        ref_id_workflow = pInput.substring( number_seperator + 1 );
    } 
    else 
    {
        return null;
    }

    return { item_field: item_field, operator, item_number: item_number, id_workflow_next: ref_id_workflow };
}


class Item 
{
    x_val : number = 0;
    m_val : number = 0;
    a_val : number = 0;
    s_val : number = 0;

    constructor( pInput : string )
    {
        const getNumber = ( pInput : string, pStart : number, pEnd : number ) : number => { 

            let num_string : string = pInput.substring( pStart, pEnd );

            return num_string.length > 0 ? Number( num_string ) : 0;
        }

        let x_pos = pInput.indexOf( "x=" );
        let m_pos = pInput.indexOf( ",m=" );
        let a_pos = pInput.indexOf( ",a=" );
        let s_pos = pInput.indexOf( ",s=" );
        let e_pos = pInput.indexOf( "}" );

        this.x_val = getNumber( pInput, x_pos + 2, m_pos );
        this.m_val = getNumber( pInput, m_pos + 3, a_pos );
        this.a_val = getNumber( pInput, a_pos + 3, s_pos );
        this.s_val = getNumber( pInput, s_pos + 3, e_pos );
    }

    // public getXVal() : number
    // {
    //     return this.x_val;
    // }

    // public setXVal( pXVal : number)
    // {
    //     this.x_val = pXVal;
    // }

    // public getMVal() : number
    // {
    //     return this.m_val;
    // }

    // public setMVal( pMVal : number )
    // {
    //     this.m_val = pMVal;
    // }

    // public getAVal() : number
    // {
    //     return this.a_val;
    // }

    // public setAVal( pAVal : number )
    // {
    //     this.a_val = pAVal;
    // }

    // public getSVal() : number
    // {
    //     return this.s_val;
    // }

    // public setSVal( pSVal : number )
    // {
    //     this.s_val = pSVal;
    // }

    public getField( pFieldID : string ) : number 
    {
        if ( pFieldID === "x" ) return this.x_val;

        if ( pFieldID === "m" ) return this.m_val;

        if ( pFieldID === "a" ) return this.a_val;

        return this.s_val;
    }

    public toString() : string 
    {
        return  "  x_val " + this.x_val + "  m_val " + this.m_val + "  a_val " + this.a_val + "  s_val " + this.s_val;
    }
}


class Rule 
{
    field : string;
    op    : string;
    nr    : number;
    id_wf : string 

    constructor( pInput : RuleParsed )
    {
        this.field = pInput.item_field;

        this.nr = pInput.item_number!;

        this.op = pInput.operator!;

        this.id_wf = pInput.id_workflow_next;
    }

    public toString() : string 
    {
        return "Field " + this.field + " OP " + this.op + " Nr " + this.nr + " = " + this.id_wf;
    }
}


class Workflow
{
    wf_name  : string;
    wf_rules : Rule[] = [];
    wf_else  : string = "";

    constructor( input : string )
    {
        const index_rule_start = input.indexOf( "{" );
        const index_rule_end  = input.indexOf( "}" );

        this.wf_name = input.substring( 0, index_rule_start );

        const rule_input = input.substring( index_rule_start + 1, index_rule_end );

        const rule_vektor : string[] = rule_input.split( "," );

        for ( let index = 0; index < rule_vektor.length; index++ )
        {
            let parsed_rule : RuleParsed | null = parseInput( rule_vektor[ index ]! )

            if ( parsed_rule != null )
            {
                this.wf_rules.push( new Rule( parsed_rule ) );
            }
            else 
            {
                this.wf_else = rule_vektor[ index ]!;
            }
        }
    }

    public toString() : string 
    {
        let str_r : string = "";

        str_r += this.wf_name + "\n";

        for ( const rrr of this.wf_rules )
        {
          str_r += rrr.toString() + "\n";
        }

        str_r += "else " +  this.wf_else + "\n";

        return str_r;
    }
}


function wl( pString : string )
{
    console.log( pString );
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    fs.writeFile( pFileName, pFileData, { flag: "w" } );

    console.log( "File created!" );
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


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let vektor_workflow : Workflow[] = [];
    let vektor_items    : Item[]     = [];

    let parse_rules : boolean = true;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str == "")
        {   
            parse_rules = false;
        }
        else if ( parse_rules )
        {
            vektor_workflow.push( new Workflow( cur_input_str ) );
        }
        else 
        {
            vektor_items.push( new Item( cur_input_str ) );
        }
    }

    wl( "Items " );

    for ( const item of vektor_items )
    {
        wl( item.toString() );
    }

    wl( "Rules" );

    for ( const wf of vektor_workflow )
    {
        wl( wf.toString() );
    }

    wl( "" );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day19_input.txt";

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

    array_test.push( "px{a<2006:qkq,m>2090:A,rfg}" );
    array_test.push( "pv{a>1716:R,A}" );
    array_test.push( "lnx{m>1548:A,A}" );
    array_test.push( "rfg{s<537:gd,x>2440:R,A}" );
    array_test.push( "qs{s>3448:A,lnx}" );
    array_test.push( "qkq{x<1416:A,crn}" );
    array_test.push( "crn{x>2662:A,R}" );
    array_test.push( "in{s<1351:px,qqz}" );
    array_test.push( "qqz{s>2770:qs,m<1801:hdj,R}" );
    array_test.push( "gd{a>3333:R,R}" );
    array_test.push( "hdj{m>838:A,pv}" );
    array_test.push( "" );
    array_test.push( "{x=787,m=2655,a=1222,s=2876}" );
    array_test.push( "{x=1679,m=44,a=2067,s=496}" );
    array_test.push( "{x=2036,m=264,a=79,s=2244}" );
    array_test.push( "{x=2461,m=1339,a=466,s=291}" );
    array_test.push( "{x=2127,m=1623,a=2188,s=1013}" );
  
    return array_test;
}


wl( "Day 19 - Aplenty" );

calcArray( getTestArray1() );

wl( "Day 19 - Ende" );

