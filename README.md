# audiences-defunct
(DEFUNCT AS OF NOV 2022 DUE TO SUNSETTING OF CERTAIN GOOGLE ADS API FEATURES) Google Ads Script that automatically removes overspending audiences and handles bid adjustments. 

# Languages Used
Javascript, Google Ads Scripts, Google Ads API

# How it Works 
This script compares each campaign's cost-per-conversion in an account to the cost-per-conversion(if there are any conversions)/cost(if there are no conversions) of every audience. If the audiences's cost-per-conversion/cost is 50% more than the campaign's cost-per-conversion, the audience is either removed or its bid is adjusted. 
