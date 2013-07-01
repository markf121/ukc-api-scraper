[![Build Status](https://travis-ci.org/stevoland/ukc-api-scraper.png)](https://travis-ci.org/stevoland/ukc-api-scraper)

```
TODO:

- Tests

- Scrape Climb page
  - Ticks

Tick styles:

Lead β - 26/Jul/08
Hidden - Lead RP - 24/May/08
Hidden - Lead O/S - 2008
Heisenberg - Lead O/S - 06/Jul/03 with fiend
craig h - Solo O/S

Sent x - 07/Jun/13 with Charlie Torrance
Souljah - Sent β - 06/May/13 with aliblacky
Dan724 - Sent x - 03/May/13 with Kyle Williamson
munch88 - Sent dnf - 17/Feb/13 with luke owens
highrepute - Sent


With guidebook info:
http://www.ukclimbing.com/logbook/c.php?i=13385

Both guidebook descriptions and other:
http://www.ukclimbing.com/logbook/c.php?i=29932

Hill:
http://www.ukclimbing.com/logbook/crag.php?id=13478

Add tick:


Request URL:http://www.ukclimbing.com/logbook/addlog.html
Request Method:POST
Status Code:200 OK
Request Headersview source
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Encoding:gzip,deflate,sdch
Accept-Language:en-US,en;q=0.8
Cache-Control:max-age=0
Content-Length:187
Content-Type:application/x-www-form-urlencoded
Cookie:climbsort=x; distance_type=0; ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland; __utma=229952408.751577799.1359988870.1369917395.1369924819.135; __utmb=229952408.7.10.1369924819; __utmc=229952408; __utmz=229952408.1369917395.134.16.utmcsr=theoldreader.com|utmccn=(referral)|utmcmd=referral|utmcct=/folders/514b7cff54cf827eed01c5bb
Host:www.ukclimbing.com
Origin:http://www.ukclimbing.com
Proxy-Connection:keep-alive
Referer:http://www.ukclimbing.com/logbook/addlog.html?climb=8775
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36 FirePHP/4Chrome
X-FirePHP-Version:0.0.6
Form Dataview sourceview URL encoded
lc:639
climb:8775
q:Last Tango in Paris (Vivian Quarry)
day:
month:5
year:2013
quickdate:0
style:20
substyle:7
description:Rested on me gear under the overlap, grr.
update:Add climb
Response Headersview source
Cache-Control:no-cache, must-revalidate
Connection:keep-alive
Content-Encoding:gzip
Content-Length:6541
Content-Type:text/html; charset=iso-8859-1
Date:Thu, 30 May 2013 14:49:30 GMT
Pragma:no-cache
Proxy-Connection:keep-alive
Server:Apache
Vary:Accept-Encoding
Via:1.1 gateb-rth.telhc.bbc.co.uk:80 (squid/2.7.STABLE6)
X-Cache:MISS from www-cache.reith.bbc.co.uk
X-UA-Compatible:IE=8


Response:

<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en' lang='en'><head><title>UKC Logbook - Add to Logbook</title>
<link rel='stylesheet' type='text/css' href='http://ukc2.com/core/core2.css' />
<link rel='shortcut icon' href='http://ukc2.com/core/favicon.ico' />
<link rel='top' title='UKC homepage' href='/' /><link rel='search' title='Search' href='/general/search.html' />
<link rel='stylesheet' type='text/css' href='http://ukc2.com/core/ajax.css' title='styles' />
<script type='text/javascript' src='livesearch.js'></script>
</head>
<body onload='liveSearchInit()'><div id='wrap'>
<a class="skiplink" href="#main" accesskey="s">Skip over navigation</a><table cellpadding="0" cellspacing="0" id="top" summary="">
<tr id='topbar'><td></td><td align='right' id='login'></td></tr>
<tr><td width='220' height='98'><div style='position:relative'><a href='/' title='UKC homepage'><img src='http://ukc2.com/core/1px.gif' width='220' height='98' border='0' alt='' /></a><a href='http://www.ukhillwalking.com/' title='UKH homepage' style='position:absolute; left:10px; top:75px'><img src='http://ukc2.com/core/miniukh.png' width='41' height='20' border='0' alt='' /></a></div></td><td id='banner'><a href='http://ads.ukclimbing.com/click.php?id=5545&amp;uri=4' target='_blank'><img src='http://ukc2.com/ads/i/5545.gif' width='728' height='90' alt='ads.ukclimbing.com' hspace='3' border='0' /></a></td></tr>
</table>
<div id="menubar" class="nocontent">
<ul>
<li>&gt; <a href="/" title="UKC homepage" accesskey="1">Home</a> &lt;</li>
<li>&gt; <a href="/forums/">Forums</a> &lt;
<ul class="drop">
<li><a href='/forums/'>Forums Latest</a></li>
<li><a href='/forums/info/search.php'>Search Forums</a></li>
<li><a href='/forums/i.php?f=16'>Premier Posts</a></li>
<li><a href='/forums/info/guidelines.html'>Posting Guidelines</a></li>
<li><a href='/forums/info/help.html'>HELP</a></li>
</ul></li>
<li class='sel'>&gt; <a href="/logbook/">Logbooks</a> &lt;
<ul class="drop">
<li><a href='/logbook/map/'>Find Crags Map</a></li>
<li><a href='/logbook/'>Search for a Climb</a></li>
<li><a href='/logbook/showlog.html'>Log my Climbs</a></li>
<li><a href='/logbook/e.php?d=2013'>Activity Diary</a></li>
<li><a href='/logbook/topascents.html'>Recent Top Ascents</a></li>
<li><a href='/logbook/help.html'>HELP</a></li>
</ul>
</li>
<li>&gt; <a href="/news/">News</a> &lt;
<ul class="drop">
<li><a href='/news/'>Latest News</a></li>
<li><a href='/articles/older.html?category=7'>Competitions</a></li>
<li><a href='/news/events.html'>Events Diary</a></li>
<li><a href='/news/newsletter.html'>Weekly Newsletter</a></li>
<li><a href='/gear/list.php?type=27&amp;brand='>Job Finder</a></li>
<li><a href='/news/older.html'>Older News</a></li>
<li><a href='/news/help.html'>HELP</a></li>
</ul></li>
<li>&gt; <a href="/photos/">Photos</a> &lt;
<ul class="drop">
<li><a href='/photos/thisweek.html'>Latest Photos</a></li>
<li><a href='/photos/top10.html'>Weekly Top 10</a></li>
<li><a href='/photos/top200.html'>Top 200 Photos</a></li>
<li><a href='/photos/author.html'>My Photo Gallery</a></li>
<li><a href='/articles/older.html?category=5'>Photo Articles</a></li>
<li><a href='/photos/help.html'>HELP</a></li>
</ul></li>
<li>&gt; <a href="/articles/">Articles</a> &lt;
<ul class="drop">
<li><a href='/articles/'>Latest Articles</a></li>
<li><a href='/articles/older.html?category=2'>Destination Articles</a></li>
<li><a href='/articles/older.html?category=3'>Climbing Skills</a></li>
<li><a href='/articles/help.html'>HELP</a></li>
</ul></li>
<li>&gt; <a href="/gear/">Gear</a> &lt;
<ul class="drop">
<li><a href='/gear/'>Latest Gear</a></li>
<li><a href='/gear/list.php?older=6'>Gear News</a></li>
<li><a href='/gear/list.php?older=4'>Gear Reviews</a></li>
<li><a href='/gear/list.php?type=7&amp;brand='>OI News</a></li>
<li><a href='/gear/help.html'>HELP</a></li>
</ul></li>
<li>&gt; <a href="/videos/" title="Climbing videos">Video</a> &lt;</li>
<li>&gt; <a href="/listings/">Classifieds</a> &lt;
<ul class="drop">
<li><a href='/listings/?t=wall'>Find Climbing Wall</a></li>
<li><a href='/listings/?t=shop'>Find Outdoor Shop</a></li>
<li><a href='/listings/?t=club'>Find Climbing Club</a></li>
<li><a href='/listings/?t=stay'>Find Accommodation</a></li>
<li><a href='/listings/?t=learn'>Find Instructor/Guide</a></li>
<li><a href='/listings/?t=gear'>Find Goods/Services</a></li>
<li><a href='/listings/help.html'>HELP</a></li>
</ul></li>
<li>&gt; <a href="/general/search.html" title="Search this site" accesskey="4">Search</a> &lt;<div id="searchbox" onmouseover='document.topsearch.q.focus()' onmouseout='document.topsearch.q.blur()'><form method="get" name="topsearch" action="/general/search.html">
<input type="hidden" name="cof" value="FORID:11" /><input type="hidden" name="ie" value="UTF-8" /><input type="hidden" name="cx" value="012320157739014986830:zyxmlwsazli" /><table cellpadding='0' cellspacing='0'><tr><td><b>Search site:&nbsp;</b></td><td><input type="text" name="q" size="25" style='width:170px' maxlength="255" value="" /></td><td><input type="image" name="sa" src="http://ukc2.com/core/searchdg.gif" alt="Go" style="padding-left:4px" /></td></tr></table></form></div></li>
</ul>
</div>

<table cellpadding="0" cellspacing="0" width="100%" summary="" id="page">
<tr valign="top">
<td id='sidenav' class='nocontent'>
<ul>
<li><a href="/logbook/index.html">Logbooks &amp; Crags</a></li>
<li><ul>
<li><a href="/logbook/map/index.html">Find Crags</a></li>
<li><a href="/logbook/showlog.html?id=111303">My Logbook</a></li>
<li class='sel'>Add to Logbook</li>
<li><a href="/logbook/addclimb.html">Add missing Climb</a></li>
<li><a href="/logbook/e.php?d=2013&amp;u=111303">My 2013 Diary</a></li>
<li><a href="/logbook/adddiary.html">Add to Diary</a></li>
<li><a href="/logbook/showlist.html?id=111303">My Wishlist</a></li>
<li><a href="/logbook/showgraph.html?id=111303">My Graphs</a></li>
<li><a href="/logbook/partners.html">Edit Partners</a></li>
<li><a href="/logbook/sets.html">Ticklists of Climbs</a></li>
<li><a href="/logbook/moderate.html">Moderate Crags</a></li>
<li><a href="/logbook/topascents.html">Recent Top Ascents</a></li>
<li><a href="/logbook/help.html">Help Page</a></li>
</ul></li>
</ul>
<center><div style='padding:7px 0 3px 0'><a href='http://ads.ukclimbing.com/click.php?id=5591&amp;uri=46' target='_blank'><img src='http://ukc2.com/ads/b/5591.jpg' width='120' height='600' alt='ads.ukclimbing.com' style='border:none' /></a>
</div>
<hr width='80%' />
<font size='1'><a href='http://ads.ukclimbing.com/' target='_blank'><img src='http://ukc2.com/core/ukc-ad.gif' width='129' height='16' vspace='2' alt="[ukc advertising]" border='1' /></a><br />
Click to read about <a href='http://ads.ukclimbing.com/' target='_blank'>Advertising on UKC</a></font></center></td>
<td id='main'>
<h1>Add to Logbook</h1>
<p>
Adding <b>Last Tango in Paris (Vivian Quarry)</b> into your logbook...
OK. [ <a href='editlog.html?id=2979458'>edit log</a> ]
<p>
You can use the below form to add another climb to your Logbook:<p>
<form method='post' name='searchform' action='addlog.html' id='searchform' onSubmit="return verify(this) && liveSearchSubmit('climb')"><input type='hidden' name='lc' value='639' />
<div id='voting' style='float:right'></div>
<table cellspacing='2' cellpadding='1'><tr valign='top'><th align='right'>Climb name</th><td><input type='hidden' name='climb' value='0' /><input type='text' id='livesearch' name='q' size='40' maxlength='117' value="" onkeypress="liveSearchStart(this)" onblur='liveSearchHideDelayed()' onChange='if (document.searchform.climb2) document.searchform.climb2.selectedIndex=0' /> <script language="JavaScript" type="text/javascript"><!--
document.write("<input name=find type=button value='Find' onClick='if (document.searchform.q.value.length < 1) { alert(\"Please enter part of the climb name to find\") } else { this.form.submit() }' />");
//  --></script>
<noscript><input name='find' type='submit' value="Find" /></noscript>
</td></tr>
<tr><td height='1'> </td><td><div id='LSResult' style='display: none'><ul id='LSShadow'> </ul></div></td></tr>
<tr><th align='right' valign='top' nowrap>Date climbed</th><td nowrap><input type='text' name='day' size='2' maxlength='2' value="" onChange='document.searchform.quickdate.selectedIndex=0' />-<select name='month' onChange='document.searchform.quickdate.selectedIndex=0'><option value='0'>month</option><option value='1'>Jan</option><option value='2'>Feb</option><option value='3'>Mar</option><option value='4'>Apr</option><option value='5' SELECTED>May</option><option value='6'>Jun</option><option value='7'>Jul</option><option value='8'>Aug</option><option value='9'>Sep</option><option value='10'>Oct</option><option value='11'>Nov</option><option value='12'>Dec</option></select>-<input type='text' name='year' size='4' maxlength='4' value="2013" onChange='document.searchform.quickdate.selectedIndex=0' /> or select <select name=quickdate onChange='if (this.selectedIndex > 0) setdate(this.value)'><option value='0'>quick dates</option><option value='20130530'>Today</option><option value='20130529'>Yesterday</option><option value='20130528'>Tue 28th</option><option value='20130527'>Mon 27th</option><option value='20130526'>Sun 26th</option><option value='20130525'>Sat 25th</option><option value='20130524'>Fri 24th</option></select><br /><font size='1'>You can leave the exact day+month blank if you can't remember or don't care!</font></td></tr>
<tr><th align='right' nowrap>Style of ascent</th><td><select name='style' onChange='document.searchform.substyle.selectedIndex=0; switchAscent(this.selectedIndex)'><option value='0'>optional</option><option value='50'>Boulder</option><option value='10'>Solo</option><option value='20' SELECTED>Lead</option><option value='60'>Alt Leads</option><option value='30'>Second</option><option value='40'>Top-rope</option></select>&nbsp;details&nbsp;<select name='substyle'><option value='0'>&nbsp;</option><option value='1'>clean onsight</option><option value='2'>clean with beta</option><option value='3'>clean no falls (repeat ascent)</option><option value='5'>clean after practice (redpoint)</option><option value='7' SELECTED>with falls/rests (dogged)</option><option value='9'>did not finish</option></select> [<a href='help.html#style' target='help' title='Read more about the different Styles of ascent'>read more</a>]<script language="JavaScript" type="text/javascript"><!--
function switchAscent(ascenttype) {
  if (ascenttype == 0) {
    document.searchform.substyle.options.length=0;
    document.searchform.substyle.options[0]=new Option(" ", 0);
  } else {
    document.searchform.substyle.options.length=0;
    document.searchform.substyle.options[0]=new Option(" ", 0);
    document.searchform.substyle.options[1]=new Option("clean onsight", 1);
    document.searchform.substyle.options[2]=new Option("clean with beta", 2);
    document.searchform.substyle.options[3]=new Option("clean no falls (repeat ascent)", 3);
    document.searchform.substyle.options[4]=new Option("clean after practice (worked)", 5);
    if (ascenttype == 1 || ascenttype == 2) {
      document.searchform.substyle.options[5]=new Option("did not finish", 9);
    } else {
      document.searchform.substyle.options[5]=new Option("with falls/rests (dogged)", 7);
      document.searchform.substyle.options[6]=new Option("did not finish", 9);
    };
  };
};
switchAscent(3);
for (i=1; i < document.searchform.substyle.options.length; i++) {
  if (document.searchform.substyle.options[i].value == 7) document.searchform.substyle.options[i].selected = true;
};
//  --></script></td></tr>
<tr valign='top'><th align='right'>Partner(s)</th><td nowrap><div id='partnersjs' style='display:none'><select name='quickpartners' onchange='addPartner(this)'><option value='0'>choose partners</option><optgroup label='recent partners'><option value='188295'>Paddy</option></optgroup></select> [<a href='#' onclick="return open_popup('addpartner.html?popup=1')" title='Add a new climbing Partner to your list'>add partner</a>]<div id='partnerstxt' style='display:none'><font size='1'>You can choose more than one partner for this climb. Untick a partner to remove them from this climb</font></div><div id='newpartners' style='margin-top:4px; display:none'></div></div>
<noscript><input type='hidden' name='noscript' value='1' /><select name='partnersmul[]' size='9' multiple><optgroup label='recent partners'><option value='188295'>Paddy</option></optgroup></select><br />
<font size=1>Hold down the [CTRL] key to select multiple partners, or click to <a href='addpartner.html' target='_blank' title='Add a new climbing Partner to your list'>Add new Partner</a></font></noscript></td></tr>
<tr><th align='right' valign='top'>Your Notes</th><td><textarea name='description' cols='50' rows='4' onFocus='if (this.value == "notes about your climb, or leave blank") this.value=""'></textarea></td></tr>
<tr><td>&nbsp;</td><td><input name='update' type='submit' value='Add climb' /></td></tr>
</table>
</form>
<p>
For multipitch routes you can select <i>Alt Leads</i> and use <i>Your Notes</i> to describe who lead which pitches, etc.<br />
Your vote is counted when you finish adding this climb to your logbook.<noscript><p><font color='#666666'>Note that your web browser doesn't support Javascript, or has Javascript disabled.<br />
If you can use a browser with Javascript enabled then this page will have improved features.</font></noscript>

<script language="JavaScript" type="text/javascript">
<!--  to hide script contents from old browsers
function verify(f)
{
  msg = "Your Logbook wasn't updated because of the following error(s):\n";
  msg += "Please correct these error(s) and re-submit.\n";
  msg += "__________________________________________________\n\n";
  err = "";
  if (f.q.value.length < 1) err += "- Enter part of the climb name to find\n";
  year = parseInt(f.year.value,10);
  day = parseInt(f.day.value,10);
  if ((f.day.value.length > 0) && (isNaN(day) || day < 1 || day > 31)) err += "- Date climbed should have a day between 1 and 31\n";
  // if (f.month.selectedIndex == 0) err += "- Please select the month you climbed it\n";
  if (f.year.value.length <= 2 && isNaN(year) == false && year >= 1 && year <= 13) f.year.value = 2000+year;
  if (f.year.value.length <= 2 && isNaN(year) == false && year <= 99 && year >= 40) f.year.value = 1900+year;
  year = parseInt(f.year.value,10);
  if (isNaN(year) || year < 1940 || year > 2013) err += "- Date climbed must have a valid 4-digit year\n";
  if (err == "") return(true);
  alert(msg + err);
  return(false);
};
function setdate(date)
{
  document.searchform.day.value=date.substr(6,2);
  document.searchform.month.selectedIndex=date.substr(4,2);
  document.searchform.year.value=date.substr(0,4);
};
/* Compatibility for old versions of MSIE without DOM */
if (document.all && !document.getElementById) {
  document.getElementById = function(id) {
    return document.all[id];
  }
};

// Called by livesearch.js on RETURN keypress, or mouse click
liveSearchFunc = function showClimb(id, name) {
  var voting = document.getElementById('voting');
  document.searchform.climb.value = id;
  document.searchform.q.value = clean(name);

  // Initiate AJAX load?
  if (!window.XMLHttpRequest && !window.ActiveXObject) return;
  if (window.XMLHttpRequest) {
    // Firefox, Opera, IE7 supports XMLHttpRequest
    var h=new XMLHttpRequest();
  } else {
    // branch for IE/Windows ActiveX version, IE6 and earlier
    var h=new ActiveXObject("Microsoft.XMLHTTP");
  };
  var j="livevotes.php?i="+id;
  h.open("GET",j,true);
  h.onreadystatechange=makeInsertLoadHandler(h, voting);
  h.send(null);
};

// Handle loading of XML data file for voting form
function makeInsertLoadHandler(n,f) {
  return function() {
    if (n.readyState==4) {
      if (n.status == 200) {
        f.innerHTML = n.responseText;
      } else {
        f.innerHTML = "Failed... error "+n.status;
      };
      n.onreadystatechange=donothing;
    };
  };
};
function donothing() {};

// Add partner selected from 'Add Partners' pulldown menu onto end of 'Partners' table cell, with checkbox
function addPartner(menu) {
  if (menu.options[menu.selectedIndex].value == 0) return;
  var lst = document.getElementById('newpartners');
  var html = "<label><input type='checkbox' name='partners[]' value='"+menu.options[menu.selectedIndex].value+"' checked style='margin:0; padding:0' /> "+menu.options[menu.selectedIndex].text+"<"+"/label><br />\n";
  document.getElementById('newpartners').style.display='';
  document.getElementById('partnerstxt').style.display='';
  lst.innerHTML += html;
};

// Add new partner from addpartners.html popup window
function newPartner(value, name) {
  var menu = document.searchform.quickpartners;
  var newOpt = new Option(name, value);
  menu.options[menu.length] = newOpt;
  menu.selectedIndex = menu.length-1;
  addPartner(menu);
};

function open_popup(page) {
  window_handle = window.open(page,'popupWindowName','width=584,height=220,menubar=0,status=0,scrollbars=0,toolbar=0');
  window_handle.focus();
  return false;
};

document.getElementById('partnersjs').style.display='';
// end hiding contents  -->
</script>

</td></tr></table>
<div id='footer' class='nocontent'><hr />
<a href='http://ads.ukclimbing.com/mediakit.html' target='_blank'>Advertising on UKClimbing</a> - <a href='/general/about.html'>About UKClimbing</a> - <a href='http://www.facebook.com/ukclimbing' target='fb'><img src='http://ukc2.com/fb/logosq.gif' width='14' height='14' border='0' style='vertical-align:middle' alt='Fb' /></a> <a href='http://www.facebook.com/ukclimbing' target='fb'>UKC on Facebook</a> - <a href='http://twitter.com/ukclimbing' target='twtr'><img src='http://ukc2.com/core/twitter.gif' width='14' height='14' border='0' style='vertical-align:middle' alt='Twtr' /></a> <a href='http://twitter.com/ukclimbing' target='twtr'>UKC on Twitter</a>
 - <a href='/general/terms.html' accesskey='8'>Terms &amp; Conditions</a> - <a href='/general/privacy.html'>Privacy Policy</a> - <a href='/general/email.html' accesskey='9'>Contact Us</a><br />
Copyright &copy; UKClimbing Limited. Last updated April 23 2013.</div>
</div>
<script type='text/javascript' src='http://ukc2.com/core/main2.js'></script>
<script type="text/javascript"><!--
var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-2305567-1']);_gaq.push(['_trackPageview']);
(function() {var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;ga.src = 'http://www.google-analytics.com/ga.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();
 --></script>
<script type="text/javascript" src="http://s.skimresources.com/js/51389X1256615.skimlinks.js"></script></body></html>







Login:

Request URL:https://www.ukclimbing.com/user/
Request Method:POST
Status Code:302 Found
Request Headersview source
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Encoding:gzip,deflate,sdch
Accept-Language:en-US,en;q=0.8
Cache-Control:max-age=0
Connection:keep-alive
Content-Length:63
Content-Type:application/x-www-form-urlencoded
Cookie:bbbb_name=stevoland; __utma=229952408.751577799.1359988870.1369995612.1370276856.138; __utmb=229952408.6.10.1370276856; __utmc=229952408; __utmz=229952408.1369917395.134.16.utmcsr=theoldreader.com|utmccn=(referral)|utmcmd=referral|utmcct=/folders/514b7cff54cf827eed01c5bb
Host:www.ukclimbing.com
Origin:http://www.ukclimbing.com
Referer:http://www.ukclimbing.com/logbook/crag.php?id=5&lgout
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36 FirePHP/4Chrome
X-FirePHP-Version:0.0.6
Form Dataview sourceview URL encoded
login:1
email:stevoland
password:14u2c
cookie:2
sa.x:12
sa.y:10
Response Headersview source
Connection:Keep-Alive
Content-Length:0
Content-Type:text/html; charset=iso-8859-1
Date:Mon, 03 Jun 2013 16:31:37 GMT
Keep-Alive:timeout=2, max=100
Location:http://www.ukhillwalking.com/general/sso.php?2cf5feae777238e3199f45c76ed4f86a
Server:Apache
Set-Cookie:ukcsid=a7b4f9eef2f6b38da54ff2052c1c5460#111303#stevoland; expires=Tue, 03-Jun-2014 16:31:38 GMT; path=/; domain=.ukclimbing.com
Set-Cookie:colours=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.ukclimbing.com
Set-Cookie:bbbb_name=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.ukclimbing.com
Set-Cookie:browserversion=0; expires=Sun, 03-Jun-2012 16:31:38 GMT; path=/; domain=.ukclimbing.com
Set-Cookie:flexible=0; expires=Sun, 03-Jun-2012 16:31:38 GMT; path=/forums/; domain=.ukclimbing.com
```