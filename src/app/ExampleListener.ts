export class ExampleListener
{
    private static _instance: ExampleListener;
    
    constructor()
    {
        ExampleListener._instance = this;
    }

    public static getInstance(): ExampleListener
    {
        if (!ExampleListener._instance) ExampleListener._instance = new ExampleListener();

        return ExampleListener._instance;
    }
}