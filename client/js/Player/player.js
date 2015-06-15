function Player() {
    this.name = "Player-";
    this.id = undefined;
    this.session = undefined;
    this.Hand = [];
    this.currentMana = 0;
    this.currentManaMax = 1;
    this.endTurn = function () {
        for (var i = 0; i < this.Hand.length; i++)
            this.Hand[i].canAttack = this.Hand[i].dropped;
        Global.socket.emit("end-turn", this.id);
    };
    this.displayMana = function () {
        for(var i = 0; i < 10; i++)
          {
             $("#mana-"+i).addClass("disabled");
          }
          for(var i = 0; i < this.currentMana; i++)
          {
             $("#mana-"+i).removeClass("disabled");
          }
    };
    this.sync = function (model) {
      this.id = model.id;
      this.currentManaMax = model.maxMana;
      this.currentMana = model.mana;
      this.name += model.id.split('-')[0];
      this.displayMana();
    };
    this.deleteCard = function(guid){
        return this.Hand.deleteCard(guid);
      };
    this.findCard = function(guid){
        return this.Hand.findCard(guid);
    };
}