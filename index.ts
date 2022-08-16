import { stringify } from "querystring";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class mobilecontrol implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    constructor() {

    }

    private _dropdown: HTMLSelectElement;
    _mobilenumber: any;
    private _container: HTMLDivElement;
    private _value: any;

    private _context: ComponentFramework.Context<IInputs>;
    private _refreshData: EventListenerOrEventListenerObject;

    private _notifyOutputChanged: () => void;


    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {

        this._container = container;

        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._refreshData = this.refreshData.bind(this);


        let dropdown = document.createElement("select");
        dropdown.setAttribute('id', 'dropdown')

        dropdown.appendChild(new Option("Austria", '+43'));
        dropdown.appendChild(new Option("Denmark", '+45')); 
        dropdown.appendChild(new Option("India", '+91'));

        dropdown.appendChild(new Option("France", '+33')); 
        dropdown.appendChild(new Option("New Zealand", '+64')); 

        dropdown.appendChild(new Option("pakistan", '+92'));
        dropdown.appendChild(new Option("Sri Lanka", '+94')); 




        this._dropdown = dropdown;


        this._mobilenumber = document.createElement('Input');

        this._mobilenumber.setAttribute('id', 'mobilenumber')








        this._container.appendChild(this._dropdown);
        this._container.appendChild(this._mobilenumber);

        this._mobilenumber.addEventListener("input", this.OnlyNumbers);
        this._dropdown.addEventListener("change", this.Dropdownchange)
        this._mobilenumber.addEventListener("change", this.textboxOnChange);


        this._value = context.parameters.sampleProperty.raw
            ? context.parameters.sampleProperty.raw
            : "";

        if (this._value != '') {

            const myArray = this._value.split(" ");




            this._mobilenumber.value = myArray[1];
            this._dropdown.value = myArray[0]
            var str = new String(myArray[1])


            this._mobilenumber.setAttribute('maxLength', str.length);
            this._mobilenumber.setAttribute('minLength', str.length);



        }
        else{

            this._dropdown.value = "+91";
            this._mobilenumber.setAttribute('maxLength', "10");
            this._mobilenumber.setAttribute('minLength', "10");
        

            this._mobilenumber.style.backgroundColor='red'
        }









    }


    public refreshData(evt: Event): void {
        this._value = this._dropdown.value + " " + this._mobilenumber.value;
        this._notifyOutputChanged();
    }


    public Dropdownchange(event: Event) {




        var dropdownvalue = (<HTMLInputElement>document.getElementById("dropdown")).value;
        (<HTMLInputElement>document.getElementById("mobilenumber")).value = ""
        if (dropdownvalue == "+91" || dropdownvalue == "+92" || dropdownvalue == "+43") {



            (<HTMLInputElement>document.getElementById("mobilenumber")).maxLength = 10;
            (<HTMLInputElement>document.getElementById("mobilenumber")).minLength = 10;


        }
        else if (dropdownvalue == "+45" || dropdownvalue == "+64") {
            (<HTMLInputElement>document.getElementById("mobilenumber")).maxLength = 8;
            (<HTMLInputElement>document.getElementById("mobilenumber")).minLength = 8;

        }
        else if (dropdownvalue == "+33" || dropdownvalue == "+94") {
            (<HTMLInputElement>document.getElementById("mobilenumber")).maxLength = 7;
            (<HTMLInputElement>document.getElementById("mobilenumber")).minLength = 7;

        }


        var inputData = (<HTMLInputElement>document.getElementById("mobilenumber"));
        var length=inputData.maxLength
        if(inputData.value.length !=length){

            (<HTMLInputElement>document.getElementById("mobilenumber")).style.backgroundColor='red'


        }
        else{
            (<HTMLInputElement>document.getElementById("mobilenumber")).style.backgroundColor=''

        }











    }

    public textboxOnChange(event: Event) {

        this._value = this._dropdown.value + " " + this._mobilenumber.value;

    }

    public OnlyNumbers(event: Event) {


        debugger
        var inputData = (<HTMLInputElement>event.target).value;
        var length=(<HTMLInputElement>event.target).maxLength
        if(inputData.length !=length){

            (<HTMLInputElement>event.target).style.backgroundColor='red'


        }
        else{
            (<HTMLInputElement>event.target).style.backgroundColor=''

        }

        //replace more than one dot
        var extractedFte = inputData.replace(/[^0-9.]/g, '').replace('.', '')
            .replace(/\./g, '').replace('x', '.');

        //Extract nuber Values
        extractedFte = extractedFte.replace(/^(\d+)\d*$/, "$1");

        //Reasign to same control
        (<HTMLInputElement>event.target).value = extractedFte;


        this._value = this._value = this._dropdown.value + " " + this._mobilenumber.value;;
        this._notifyOutputChanged();









    }








    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view

        this._context = context;

        this._value = this._dropdown.value + " " + this._mobilenumber.value;

        this._notifyOutputChanged();





    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        //     return this._mobilenumber ? { sampleProperty: this._mobilenumber } : { sampleProperty: this._mobilenumber };
        //
        return { sampleProperty: this._value }
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary

    }
}
