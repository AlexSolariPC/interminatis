function Card(hand, power, hp, talentName, manacost, guid, name, desc) {
    this.talent = new Talent(talentName);
    this.power = power;
    this.hp = hp;
    this.cost = manacost;
    this.id = guid;
    this.isEnemy = (hand == "#your");
    this.canAttack = false;
    this.name = name || "";
    this.desc = desc || "";
    this.dropped = false;
    
    this.visual = $("<div></div>");
    $(this.visual).attr("id",this.id);
    this.visual.isOnField = false;
    this.visual.appendTo(hand);
    this.visual.addClass("card");
    this.visual.addClass(this.talent.getClass());
    
    this.visual.imageBlock = $("<div></div>");
    this.visual.imageBlock.appendTo(this.visual);
    this.visual.imageBlock.addClass("image");
    
    this.visual.desc = $("<div></div>");
    this.visual.desc.appendTo(this.visual);
    this.visual.desc.addClass("description");
    this.visual.desc.html(this.name+"<br><i>"+this.desc+"</i><br>"+this.talent.getDescription())
    
    this.visual.hpBlock = $("<div></div>");
    this.visual.hpBlock.appendTo(this.visual);
    this.visual.hpBlock.addClass("hp").addClass("attribure");
    
    if (this.cost >= 0)
    {
      this.visual.manacostBlock = $("<div></div>");
      this.visual.manacostBlock.appendTo(this.visual);
      this.visual.manacostBlock.addClass("manacost").addClass("attribure");
    }
    
    this.visual.dmgBlock = $("<div></div>");
    this.visual.dmgBlock.appendTo(this.visual);
    this.visual.dmgBlock.addClass("dmg").addClass("attribure");
    
    $(this.visual).draggable({
          containment: "#dragg-allowed-area", 
          start: function(){
            $(this).addClass("picked")
          },
          stop: function(event, ui){
            var Y = $(this).css("top").split("px")[0];
            if (Y  <= -100) {
              Global.socket.emit("card-drop", this.id);
            }
            else $(this).css("top", "0px");
            $(this).removeClass("picked");
          }
        });
    $(this.visual).on('touchmove', function(event) {
      var touch = event.targetTouches[0];
      alert(JSON.stringify(touch));
      this.visual.style.left = touch.pageX-25 + 'px';
      this.visual.style.top = touch.pageY-25 + 'px';
      event.preventDefault();
    }, false);
    this.updateVisual = function() {
      if (this.hp < 1 && this.dropped) 
      {
        this.visual.fadeOut(500);
        var cardsOnField = [];
        if (!this.isEnemy)
        {
          Global.enemyCardsOnField--;;
          cardsOnField = Global.enemyDroppedCards;
        }
        else
        {
          Global.myCardsOnField--;
          cardsOnField = Global.myDroppedCards;
        }
        cardsOnField.deleteCard(this.id);
        for (var i = 0; i < cardsOnField.length; i++)
        {
          $(cardsOnField[i].visual).animate({ left:  Global.cardOffset + (i+1)*130 + "px"}, 500);
        }
      }
      this.visual.hpBlock.html(this.hp);
      if (this.cost >= 0) this.visual.manacostBlock.html(this.cost);
      this.visual.dmgBlock.html(this.power);
      if (!this.canAttack) this.visual.addClass("inactive");
      else this.visual.removeClass("inactive");
    };
    this.processCardDropResult = function(result, isEnemy) {
      var self = $(this.visual);
      if (result)
      {
        this.dropped = true;
        this.canAttack = (this.talent.name == "charge");
        self.css("z-index", "100");
        if (isEnemy)
        {
          Global.enemyDroppedCards.push(this);
          Global.enemyCardsOnField++;
          self.css("top", "150px");
          self.css("left", Global.cardOffset + Global.enemyCardsOnField*130 + "px");
          self.click(function() {
            if (Global.activeCard == null) 
              return false;
            Global.socket.emit("attack", {
              playerId: Global.Player.id, 
              attackedId: self.attr("id"),
              attackerId: Global.activeCard.attr("id")
            });
          });
        }
        else
        {
          Global.myDroppedCards.push(this);
          self.click(function() {
            if (Global.activeCard != self)
            {
              if (Global.activeCard != null) 
              {
                Global.activeCard.toggleClass("active");
              }
              self.toggleClass("active");
              $("#select-target").fadeIn(100);
              Global.isTargetingModeActive = true;  
              Global.activeCard = self;
            }
            else
            {
              self.toggleClass("active");
              $("#select-target").fadeOut(100);
              Global.isTargetingModeActive = false;  
              Global.activeCard = null;
            }
          });
          Global.myCardsOnField++;
          self.css("top", "-220px");
          self.css("left", Global.cardOffset + Global.myCardsOnField*130 + "px");
        }
        this.canAttack = false;
        self.isOnField = true;
        self.css("position", "absolute");
        
        self.addClass("disabled");
        self.draggable("destroy");
      }
      else self.css("top", "0px");
      this.updateVisual();
      return this;
    };
    this.sync = function(model) {
      this.hp = model.hp;
      this.canAttack = model.canAttack;
      if (this.talent.name != model.talentName) 
      {
        this.visual.removeClass(this.talent.getClass());
        this.talent = new Talent(model.talentName);
        this.visual.addClass(this.talent.getClass());
      }
      this.updateVisual();
    };
    
    this.updateVisual();
}

function cardFromModel(model, hand) {
  return new Card(hand, model.power, model.hp, model.talentName, model.cost, model.id, model.name, model.desc);
}
