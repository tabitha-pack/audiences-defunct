function main(){
  
   function percentageAdjustment(audienceBiddingField){
       /perform bid adjustments by % on audience segments/
       var oldBid = audienceBiddingField.getBidModifier(); 
       var newBid = oldBid - .10;
       audienceBiddingField.setBidModifier(newBid);
       console.log(audienceBiddingField.getBidModifier());  
    }
    
    function binaryAdjustment(theAudience){
      //perform enable or exclude
      console.log(theAudience);
      theAudience.remove();
      console.log(theAudience.isEnabled());
    }
    
  const percentIncrease = 50; 
  const minClicks = 20; 
  const minConversions = 5;
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
   if (day < 10) {
    day = '0' + day;
   }
  
    let currentDate = `${year}${month}${day}`;
    console.log(currentDate); 
  
   
  var campaignSelector = AdsApp
      .campaigns()
      .forDateRange("ALL_TIME");
  var campaignIterator = campaignSelector.get();
  
      while(campaignIterator.hasNext()){
        var campaign = campaignIterator.next(); 
        var activeCampaign = campaign.isEnabled();
        var baseCampaign = campaign.isBaseCampaign();
      
         if (activeCampaign && baseCampaign) {  
           var campaignName = campaign.getName();
           var biddingType = campaign.getBiddingStrategyType();
           var campaignAudiences = campaign.targeting().audiences().get();
           var audiencesCount = campaignAudiences.totalNumEntities();
      
          if(audiencesCount > 0){
            var stats = campaign.getStatsFor("20211129", currentDate); /*INSERT CUSTOM DATE*/
            var conversions = stats.getConversions();   
            var cost = stats.getCost();
            var cCostConv = cost/conversions; 
            console.log('campaign cost/conv:' + cCostConv);
        
              while (campaignAudiences.hasNext()) {
                var audience = campaignAudiences.next();                         
                var biddingField = audience.bidding();
                var currentBid = biddingField.getBidModifier();
                console.log('Campaign:' + campaignName + ' Audience: ' + audience.getName() + ' ' + currentBid);          
                var audienceStats = audience.getStatsFor("20211129", currentDate); /*INSERT CUSTOM DATE*/
                var audienceCost = audienceStats.getCost(); 
                var audienceConversions = audienceStats.getConversions(); 
                var audienceClicks = audienceStats.getClicks(); 
                 if (audienceConversions > minConversions && audienceClicks > minClicks){
                   var audienceCostConv = audienceCost/audienceConversions;
                   var difference = audienceCostConv - cCostConv;
                   var increase = (difference/cCostConv) * 100;
    
                    if(increase >= percentIncrease){
                     console.log(increase);
                       if(biddingType === 'MAXIMIZE_CONVERSIONS'){
                         binaryAdjustment(audience); 
                       }
                       if(biddingType === 'TARGET_SPEND'){
                         var modifyBid = audience.bidding();
                         percentageAdjustment(modifyBid); 
                        }
                     }
                   }else if (audienceConversions == 0 && audienceClicks > minClicks) {
                     var difference = audienceCost - cCostConv; 
                     var increase = (difference/cCostConv) * 100;
                     
                      if(increase >= percentIncrease){
                       console.log(increase);
                         if(biddingType === 'MAXIMIZE_CONVERSIONS'){                                        
                           binaryAdjustment(audience); 
                         }
                         if(biddingType === 'TARGET_SPEND'){        
                           var modifyBid = audience.bidding();
                           percentageAdjustment(modifyBid); 
                         }
                     }  
                 } /*audience conversions = 0 loop */
              }/*campaign audiences loop*/
        
          }else {
             var adGroupSelector = AdsApp
              .adGroups()
              .forDateRange("ALL_TIME");
             var adGroupIterator = adGroupSelector.get(); 
               while(adGroupIterator.hasNext()){
                var adGroup = adGroupIterator.next();
                var activeAdGroup = adGroup.isEnabled();
                  if (activeAdGroup) {
                   var adGroupCampaign = adGroup.getCampaign();
                   var adGroupCampaignName = adGroupCampaign.getName();
                   var adGroupName = adGroup.getName();
                    if(campaignName == adGroupCampaignName){
                    
                      var adGroupAudienceSelector = adGroup.targeting()
                        .audiences()
                        .forDateRange("ALL_TIME");
                       
                      var audienceIterator = adGroupAudienceSelector.get();
                        while (audienceIterator.hasNext()) {
                          var audience = audienceIterator.next();                             
                          var biddingField = audience.bidding();
                          var currentBid = biddingField.getBidModifier();
                          console.log('adGroup Name: ' + adGroupName + 'Audience Name: ' + audience.getName() + ' ' + currentBid);                       
                          var audienceStats = audience.getStatsFor("20211129", currentDate);  /*INSERT CUSTOM DATE*/
                          var audienceCost = audienceStats.getCost(); 
                          var audienceConversions = audienceStats.getConversions(); 
                          var audienceClicks = audienceStats.getClicks(); 
                            if (audienceConversions > minConversions && audienceClicks > minClicks){
                             var audienceCostConv = audienceCost/audienceConversions;
                             var difference = audienceCostConv - cCostConv;
                             var increase = (difference/cCostConv) * 100;
                             
                               if(increase >= percentIncrease){
                                console.log(increase);
                                 if(biddingType === 'MAXIMIZE_CONVERSIONS'){
                                  binaryAdjustment(audience); 
                                 }
                                 if(biddingType === 'TARGET_SPEND'){
                                  var modifyBid = audience.bidding();
                                  percentageAdjustment(modifyBid); 
                                 }
                                }
                            }else if (audienceConversions == 0 && audienceClicks > minClicks) {
                              var difference = audienceCost - cCostConv; 
                              var increase = (difference/cCostConv) * 100;
                             
                               if(increase >= percentIncrease){
                                console.log(increase);
                                if(biddingType === 'MAXIMIZE_CONVERSIONS'){                                        
                                 binaryAdjustment(audience); 
                                }
                                if(biddingType === 'TARGET_SPEND'){        
                                 var modifyBid = audience.bidding();
                                 percentageAdjustment(modifyBid); 
                                }
                               }    
                            } /*audience conversions = 0 loop */
                           }/*adgroup audience iterator*/
                       
                   } /match campaign and adgroup campaign names/
                  } /*if active adgroup loop*/ 
           } /adgroup iterator loop/
      }/*if no campaign audiences, go to adgroup audiences loop */
  } /*if active campaign & base campaign loop*/
  } /*campaign iterator*/  
    
} /main loop/
