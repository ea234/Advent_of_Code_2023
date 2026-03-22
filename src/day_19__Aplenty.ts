import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/19
 * 
 * https://www.reddit.com/r/adventofcode/comments/18ltr8m/2023_day_19_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day19/day_19__Aplenty.js
 * Day 19 - Aplenty
 * Items
 *   x_val 787  m_val 2655  a_val 1222  s_val 2876
 *   x_val 1679  m_val 44  a_val 2067  s_val 496
 *   x_val 2036  m_val 264  a_val 79  s_val 2244
 *   x_val 2461  m_val 1339  a_val 466  s_val 291
 *   x_val 2127  m_val 1623  a_val 2188  s_val 1013
 * 
 * Rules
 * px
 * Field a OP < Nr 2006 = qkq
 * Field m OP > Nr 2090 = A
 * else rfg
 * 
 * pv
 * Field a OP > Nr 1716 = R
 * else A
 * 
 * lnx
 * Field m OP > Nr 1548 = A
 * else A
 * 
 * rfg
 * Field s OP < Nr 537 = gd
 * Field x OP > Nr 2440 = R
 * else A
 * 
 * qs
 * Field s OP > Nr 3448 = A
 * else lnx
 * 
 * qkq
 * Field x OP < Nr 1416 = A
 * else crn
 * 
 * crn
 * Field x OP > Nr 2662 = A
 * else R
 * 
 * in
 * Field s OP < Nr 1351 = px
 * else qqz
 * 
 * qqz
 * Field s OP > Nr 2770 = qs
 * Field m OP < Nr 1801 = hdj
 * else R
 * 
 * gd
 * Field a OP > Nr 3333 = R
 * else R
 * 
 * hdj
 * Field m OP > Nr 838 = A
 * else pv
 * 
 *   x_val 787  m_val 2655  a_val 1222  s_val 2876  in -> qqz -> qs -> lnx -> A
 * 
 *   x_val 1679  m_val 44  a_val 2067  s_val 496  in -> px -> rfg -> gd -> R
 * 
 *   x_val 2036  m_val 264  a_val 79  s_val 2244  in -> qqz -> hdj -> pv -> A
 * 
 *   x_val 2461  m_val 1339  a_val 466  s_val 291  in -> px -> qkq -> crn -> R
 * 
 *   x_val 2127  m_val 1623  a_val 2188  s_val 1013  in -> px -> rfg -> A
 * 
 * Result Part 1 = 19114
 * Result Part 2 = 0
 * 
 */


type RuleParsed = {
  item_field       : string;   
  operator         : "<" | ">" | "=" | null;
  check_value      : number | null;
  id_workflow_next : string;  
};


function parseInput( pInput : string) : RuleParsed | null 
{
    let item_field = "";

    let operator: "<" | ">" | "=" | null = null;
    
    let check_value: number | null = null;

    let ref_id_workflow = "";

    const opperator_index = pInput.search( /[<>=]/ );

    const number_seperator = pInput.indexOf( ":" )

    if ( opperator_index !== -1 ) 
    {
        item_field = pInput.substring( 0, opperator_index );

        operator = pInput[ opperator_index ] as "<" | ">" | "=";

        let str_value = pInput.substring( opperator_index + 1, number_seperator );

        check_value = str_value.length > 0 ? Number( str_value ) : null;

        ref_id_workflow = pInput.substring( number_seperator + 1 );
    } 
    else 
    {
        return null;
    }

    return { item_field: item_field, operator, check_value: check_value, id_workflow_next: ref_id_workflow };
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

    public getField( pFieldID : string ) : number 
    {
        if ( pFieldID === "x" ) return this.x_val;

        if ( pFieldID === "m" ) return this.m_val;

        if ( pFieldID === "a" ) return this.a_val;

        return this.s_val;
    }

    public getValueAll() : number
    {
        return this.x_val + this.m_val + this.a_val + this.s_val;
    }

    public toString() : string 
    {
        return  "  x_val " + this.x_val + "  m_val " + this.m_val + "  a_val " + this.a_val + "  s_val " + this.s_val;
    }
}


class Rule 
{
    item_field   : string;
    op           : string;
    check_value  : number;
    wf_id_result : string 

    constructor( pInput : RuleParsed )
    {
        this.item_field = pInput.item_field;

        this.check_value = pInput.check_value!;

        this.op = pInput.operator!;

        this.wf_id_result = pInput.id_workflow_next;
    }

    public checkItem( pItem : Item ) : string | null
    {
        let item_field_value = pItem.getField( this.item_field );

        let knz_rule_applies : boolean = false;

        if ( this.op === "<" )
        {
            knz_rule_applies = item_field_value < this.check_value;
        }
        else if ( this.op === ">" )
        {
            knz_rule_applies = item_field_value > this.check_value;
        }
        else if ( this.op === "=" )
        {
            knz_rule_applies = item_field_value === this.check_value;
        }

        if ( knz_rule_applies )
        {
            return this.wf_id_result;
        }

        return null;
    }

    public toString() : string 
    {
        return "Field " + this.item_field + " OP " + this.op + " Nr " + this.check_value + " = " + this.wf_id_result;
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
        const index_rule_end   = input.indexOf( "}" );

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

    public checkItem( pItem : Item ) : string 
    {
        for ( const cur_rule of this.wf_rules )
        {
            let cur_id_wf = cur_rule.checkItem( pItem );

            if ( cur_id_wf !== null )
            {
                return cur_id_wf;
            }
        }

        return this.wf_else;
    }

    public getWorkflowID() : string 
    {
        return this.wf_name;
    }

    public isWorkflowID( pName : string ) : boolean
    {
        return this.wf_name === pName;
    }

    public toString() : string 
    {
        let str_result : string = "";

        str_result += this.wf_name + "\n";

        for ( const rule_inst of this.wf_rules )
        {
          str_result += rule_inst.toString() + "\n";
        }

        str_result += "else " + this.wf_else + "\n";

        return str_result;
    }
}


function wl( pString : string )
{
    console.log( pString );
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let vektor_workflow : Workflow[] = [];
    let vektor_items    : Item[]     = [];

    let parse_rules     : boolean = true;

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

    if ( pKnzDebug )
    {
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
    }

    const getWorkflowInst = ( pWorkflowID : string ) : Workflow | null => { 

            for ( const wf of vektor_workflow )
            {
                if ( wf.isWorkflowID( pWorkflowID ) )
                {
                    return wf;
                }
            }

            return null;
    }

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const item of vektor_items )
    {
        let knz_item_rejected : boolean = false;
        let knz_item_accepted : boolean = false;

        let debug_s : string = "";

        let result_wf = "in"; //vektor_workflow[0]!.getWorkflowID();
        
        while ( ( knz_item_rejected === false ) && ( knz_item_accepted === false ) ) 
        {
            debug_s += result_wf + " -> ";

            let cur_wf : Workflow = getWorkflowInst( result_wf )!;

            result_wf = cur_wf!.checkItem( item );

            knz_item_rejected = result_wf === "R";
            knz_item_accepted = result_wf === "A";
        }

        debug_s += result_wf;

        wl( item.toString() + "  " + debug_s );

        if ( knz_item_accepted ) { result_part_01 += item.getValueAll();}
    }

    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
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

        calcArray( arrFromFile, false );
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
//checkReaddatei();

wl( "Day 19 - Ende" );

