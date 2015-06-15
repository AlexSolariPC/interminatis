function Talent(name) {
    this.name = name;
    switch (name) {
        case 'taunt':
            this.desc = '<abbr title="Protecting allies, forcing the enemy to deal with them first.">Taunt</abbr>';
            this.specialClass = "talent-taunt";
            this.id = 1;
            break;
        case 'holy-shield':
            this.desc = '<abbr title="Absorbs the first source of damage taken, removing the shield.">Holy Shield</abbr>';
            this.specialClass = "talent-shield";
            this.id = 2;
            break;
        case 'holy-shield-broken':
            this.desc = '<abbr title="Absorbs the first source of damage taken, removing the shield.">Holy Shield</abbr>';
            this.specialClass = "talent-shield-broken";
            this.id = 2;
            break;
        case 'charge':
            this.desc = '<abbr title="Enables to attack on the same turn that it is summoned.">Charge</abbr>';
            this.specialClass = "talent-charge";
            this.id = 3;
            break;
        case 'hero':
            this.desc = '<abbr title="Main unit of army">Hero</abbr>';
            this.specialClass = "talent-hero";
            this.id = 4;
            break;
        case 'new-card':
            this.desc = '<abbr title="Gain\'s additional card">Card draw</abbr>';
            this.specialClass = "";
            this.id = 5;
            break;
        case 'new-card-2':
            this.desc = '<abbr title="Gain\'s 2 additional cards">Card draw x2</abbr>';
            this.specialClass = "";
            this.id = 5;
            break;
        case 'new-card-2':
            this.desc = '<abbr title="Gain\'s 4 additional cards">Card draw x4</abbr>';
            this.specialClass = "";
            this.id = 5;
            break;
        default:
            this.id = 0;
            this.specialClass = "";
            this.desc = "&nbsp;";
    }
    this.getDescription = function() {
        return "<strong>"+this.desc+"</strong>";
    };
    this.getClass = function() {
        return this.specialClass;
    };
}