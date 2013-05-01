WIP


Crag

id
name
area
country
rock type
altitude
faces: []


Crag.hasOne(Area)
Crag.hasOne(RockType)
Crag.hasMany(Climb)
Crag.hasMany(Guidebook)
Crag.hasMany(Map)
Crag.hasMany(Photo)
Crag.hasMany(Comment)


Guidebook.hasMany(Crag)


Climb = {
    id,
    ukcId,
    name,
    ukTechnicalGrade
}
Climb.hasOne(Crag);
Climb.hasOne(GradeType);
Climb.hasOne(Grade);
Climb.hasOne(Climb, {
    foreignKey: PreviousClimb
});
Climb.hasOne(Climb, {
    foreignKey: NextClimb
});


guidebooks: [
{
    title:
    isbn:
    id:
    year:
    in_print:
    author:
    publisher
    country:
    review:
    cover:
    pages: [
    ]
}
]

crag features
grid ref
maps: [
 {
    type:
    number:
    title:
 }
],
location: {
    latitude:
    longitude:
}

access notes

bmc access notes id

comments: []

photos: []




/crags/[id]

/crags/[id]/climbs/

/area/[name]/crags/


Climb

id
name
grade
grade_type
stars
height
pitches
crag_id
first_ascent: {
    names:
    date:
}
previous_climb: {
    id:
    name:
}
next_climb: {
    id:
    name:
}

ticks: [{
    id:
    name:
    style:
    date
}]
photos: []




buttress divider


area
crag
climb
guidebook
tick
photo
comment
map
gradetype
grade





<option value="0">type of climb</option>
<option value="1">Winter</option>
<option value="2">Trad</option>
<option value="3">Sport</option>
<option value="4">Bouldering</option>
<option value="5">Aid</option>
<option value="6">Alpine</option>
<option value="7">Ice</option>
<option value="10">Mixed</option>
<option value="11">Via Ferrata</option>
<option value="12">Scrambling</option>
<option value="13">Special</option>



<option value="12">British - M</option>
<option value="13">British - D</option>
<option value="15">British - HD</option>
<option value="16">British - VD</option>
<option value="17">British - HVD</option>
<option value="18">British - MS</option>
<option value="19">British - S</option>
<option value="20">British - HS</option>
<option value="21">British - MVS</option>
<option value="22">British - VS</option>
<option value="23">British - HVS</option>
<option value="24">British - E1</option>
<option value="25">British - E2</option>
<option value="57">British - E3</option>
<option value="58">British - E4</option>
<option value="59">British - E5</option>
<option value="60">British - E6</option>
<option value="61">British - E7</option>
<option value="62">British - E8</option>
<option value="63">British - E9</option>
<option value="64">British - E10</option>
<option value="65">British - E11</option>
<option value="381">British - E12</option>
<option value="66">British - none</option>
<option value="67">British - XS</option>
<option value="274">USA - 5.1</option>
<option value="275">USA - 5.2</option>
<option value="276">USA - 5.3</option>
<option value="277">USA - 5.4</option>
<option value="278">USA - 5.5</option>
<option value="279">USA - 5.6</option>
<option value="280">USA - 5.7</option>
<option value="281">USA - 5.8</option>
<option value="282">USA - 5.9</option>
<option value="283">USA - 5.10a</option>
<option value="284">USA - 5.10b</option>
<option value="285">USA - 5.10c</option>
<option value="286">USA - 5.10d</option>
<option value="287">USA - 5.11a</option>
<option value="288">USA - 5.11b</option>
<option value="289">USA - 5.11c</option>
<option value="290">USA - 5.11d</option>
<option value="291">USA - 5.12a</option>
<option value="292">USA - 5.12b</option>
<option value="293">USA - 5.12c</option>
<option value="294">USA - 5.12d</option>
<option value="295">USA - 5.13a</option>
<option value="296">USA - 5.13b</option>
<option value="297">USA - 5.13c</option>
<option value="298">USA - 5.13d</option>
<option value="299">USA - 5.14a</option>
<option value="300">USA - 5.14b</option>
<option value="301">USA - 5.14c</option>
<option value="302">USA - 5.14d</option>
<option value="303">USA - 5.15a</option>
<option value="404">French - F2</option>
<option value="405">French - F2+</option>
<option value="406">French - F3</option>
<option value="407">French - F3+</option>
<option value="408">French - F4</option>
<option value="409">French - F4+</option>
<option value="410">French - F5</option>
<option value="411">French - F5+</option>
<option value="412">French - F6a</option>
<option value="413">French - F6a+</option>
<option value="414">French - F6b</option>
<option value="415">French - F6b+</option>
<option value="416">French - F6c</option>
<option value="417">French - F6c+</option>
<option value="418">French - F7a</option>
<option value="419">French - F7a+</option>
<option value="420">French - F7b</option>
<option value="421">French - F7b+</option>
<option value="422">French - F7c</option>
<option value="423">French - F7c+</option>
<option value="424">French - F8a</option>
<option value="425">French - F8a+</option>
<option value="426">French - F8b</option>
<option value="427">French - F8b+</option>
<option value="428">French - F8c</option>
<option value="429">French - F8c+</option>
<option value="430">French - F9a</option>
<option value="431">French - F9a+</option>
<option value="432">French - F9b</option>
<option value="434">Australian - 4</option>
<option value="435">Australian - 5</option>
<option value="436">Australian - 6</option>
<option value="437">Australian - 7</option>
<option value="438">Australian - 8</option>
<option value="439">Australian - 9</option>
<option value="440">Australian - 10</option>
<option value="441">Australian - 11</option>
<option value="442">Australian - 12</option>
<option value="443">Australian - 13</option>
<option value="444">Australian - 14</option>
<option value="445">Australian - 15</option>
<option value="446">Australian - 16</option>
<option value="447">Australian - 17</option>
<option value="448">Australian - 18</option>
<option value="449">Australian - 19</option>
<option value="450">Australian - 20</option>
<option value="451">Australian - 21</option>
<option value="452">Australian - 22</option>
<option value="453">Australian - 23</option>
<option value="454">Australian - 24</option>
<option value="455">Australian - 25</option>
<option value="456">Australian - 26</option>
<option value="457">Australian - 27</option>
<option value="458">Australian - 28</option>
<option value="459">Australian - 29</option>
<option value="460">Australian - 30</option>
<option value="461">Australian - 31</option>
<option value="462">Australian - 32</option>
<option value="463">Australian - 33</option>
<option value="464">Australian - 34</option>
<option value="465">Australian - 35</option>
<option value="466">Australian - 36</option>
<option value="467">Australian - 37</option>
<option value="469">Nordic - n2</option>
<option value="470">Nordic - n3</option>
<option value="571">Nordic - n3+</option>
<option value="471">Nordic - n4</option>
<option value="472">Nordic - n4+</option>
<option value="473">Nordic - n5-</option>
<option value="474">Nordic - n5</option>
<option value="475">Nordic - n5+</option>
<option value="476">Nordic - n6-</option>
<option value="477">Nordic - n6</option>
<option value="478">Nordic - n6+</option>
<option value="479">Nordic - n7-</option>
<option value="480">Nordic - n7</option>
<option value="481">Nordic - n7+</option>
<option value="482">Nordic - n8-</option>
<option value="483">Nordic - n8</option>
<option value="484">Nordic - n8+</option>
<option value="485">Nordic - n9-</option>
<option value="486">Nordic - n9</option>
<option value="487">Nordic - n9+</option>
<option value="488">UIAA - I</option>
<option value="489">UIAA - II</option>
<option value="490">UIAA - III</option>
<option value="493">UIAA - III+</option>
<option value="494">UIAA - IV</option>
<option value="495">UIAA - IV+</option>
<option value="496">UIAA - V-</option>
<option value="497">UIAA - V</option>
<option value="498">UIAA - V+</option>
<option value="499">UIAA - VI-</option>
<option value="500">UIAA - VI</option>
<option value="501">UIAA - VI+</option>
<option value="502">UIAA - VII-</option>
<option value="503">UIAA - VII</option>
<option value="504">UIAA - VII+</option>
<option value="505">UIAA - VIII-</option>
<option value="506">UIAA - VIII</option>
<option value="507">UIAA - VIII+</option>
<option value="508">UIAA - IX-</option>
<option value="509">UIAA - IX</option>
<option value="510">UIAA - IX+</option>
<option value="511">UIAA - X-</option>
<option value="512">UIAA - X</option>
<option value="513">UIAA - X+</option>
<option value="514">UIAA - XI-</option>
<option value="515">UIAA - XI</option>
<option value="516">UIAA - XI+</option>
<option value="517">UIAA - XII-</option>
<option value="518">UIAA - XII</option>
<option value="519">UIAA - XII+</option>
</select>

<option value="127">V-grades - VB</option>
<option value="128">V-grades - V0-</option>
<option value="129">V-grades - V0</option>
<option value="130">V-grades - V0+</option>
<option value="131">V-grades - V1</option>
<option value="132">V-grades - V2</option>
<option value="133">V-grades - V3</option>
<option value="134">V-grades - V4</option>
<option value="135">V-grades - V5</option>
<option value="136">V-grades - V6</option>
<option value="137">V-grades - V7</option>
<option value="138">V-grades - V8</option>
<option value="139">V-grades - V8+</option>
<option value="140">V-grades - V9</option>
<option value="141">V-grades - V10</option>
<option value="142">V-grades - V11</option>
<option value="143">V-grades - V12</option>
<option value="144">V-grades - V13</option>
<option value="145">V-grades - V14</option>
<option value="146">V-grades - V15</option>
<option value="147">Font - font 3</option>
<option value="148">Font - font 3+</option>
<option value="573">Font - font 2</option>
<option value="574">Font - font 2+</option>
<option value="149">Font - font 4</option>
<option value="175">Font - font 4+</option>
<option value="176">Font - font 5</option>
<option value="177">Font - font 5+</option>
<option value="178">Font - f6A</option>
<option value="179">Font - f6A+</option>
<option value="180">Font - f6B</option>
<option value="181">Font - f6B+</option>
<option value="182">Font - f6C</option>
<option value="183">Font - f6C+</option>
<option value="184">Font - f7A</option>
<option value="185">Font - f7A+</option>
<option value="186">Font - f7B</option>
<option value="187">Font - f7B+</option>
<option value="188">Font - f7C</option>
<option value="189">Font - f7C+</option>
<option value="190">Font - f8A</option>
<option value="191">Font - f8A+</option>
<option value="192">Font - f8B</option>
<option value="193">Font - f8B+</option>
<option value="194">Font - f8C</option>


<option value="73">A1</option>
<option value="74">A2</option>
<option value="75">A3</option>
<option value="77">A4</option>
<option value="78">A5</option>



<option value="362">F</option>
<option value="363">F+</option>
<option value="364">PD-</option>
<option value="365">PD</option>
<option value="366">PD+</option>
<option value="367">AD-</option>
<option value="368">AD</option>
<option value="369">AD+</option>
<option value="370">D-</option>
<option value="371">D</option>
<option value="372">D+</option>
<option value="373">TD-</option>
<option value="374">TD</option>
<option value="375">TD+</option>
<option value="376">ED1</option>
<option value="377">ED2</option>
<option value="378">ED3</option>
<option value="379">ED4</option>
<option value="380">ED5</option>


<option value="85">WI1</option>
<option value="86">WI2</option>
<option value="87">WI2+</option>
<option value="88">WI3</option>
<option value="89">WI3+</option>
<option value="90">WI4</option>
<option value="91">WI4+</option>
<option value="92">WI5</option>
<option value="93">WI5+</option>
<option value="94">WI6</option>
<option value="95">WI6+</option>
<option value="96">WI7</option>
<option value="569">WI8</option>



<option value="196">M1</option>
<option value="554">M1+</option>
<option value="197">M2</option>
<option value="555">M2+</option>
<option value="198">M3</option>
<option value="556">M3+</option>
<option value="199">M4</option>
<option value="557">M4+</option>
<option value="200">M5</option>
<option value="558">M5+</option>
<option value="201">M6</option>
<option value="559">M6+</option>
<option value="202">M7</option>
<option value="560">M7+</option>
<option value="203">M8</option>
<option value="561">M8+</option>
<option value="204">M9</option>
<option value="562">M9+</option>
<option value="205">M10</option>
<option value="563">M10+</option>
<option value="206">M11</option>
<option value="564">M11+</option>
<option value="207">M12</option>
<option value="565">M12+</option>
<option value="550">M13</option>
<option value="566">M13+</option>
<option value="551">M14</option>
<option value="567">M14+</option>
<option value="552">M15</option>



<option value="338">VF1A</option>
<option value="339">VF1B</option>
<option value="340">VF1C</option>
<option value="341">VF2A</option>
<option value="342">VF2B</option>
<option value="343">VF2C</option>
<option value="344">VF3A</option>
<option value="345">VF3B</option>
<option value="346">VF3C</option>
<option value="347">VF4A</option>
<option value="348">VF4B</option>
<option value="349">VF4C</option>
<option value="350">VF5A</option>
<option value="351">VF5B</option>
<option value="352">VF5C</option>



<option value="354">1</option>
<option value="355">2</option>
<option value="356">3</option>
<option value="357">3S</option>


<option value="572">  - summit</option>




<select name="rocktype">
<option value="36">Amphibiolite &amp; S</option>
<option value="29">Andesite</option>
<option value="35">Artificial</option>
<option value="22">Basalt</option>
<option value="33">Chalk</option>
<option value="38">Conglomerate</option>
<option value="12">Crumbly rubbish</option>
<option value="20">Culm</option>
<option value="32">Diorites</option>
<option value="14">Dolerite</option>
<option value="28">Epidiorite</option>
<option value="16">Gabbro</option>
<option value="19">Gneiss</option>
<option value="4">Granite</option>
<option value="27">Granodiorite</option>
<option value="10">Greenstone</option>
<option value="17">Greywacke</option>
<option value="13">Grit (quarried)</option>
<option value="5">Gritstone</option>
<option value="34">Hornstone</option>
<option value="39">Ice</option>
<option value="40">Ignimbrite</option>
<option value="43">Iron Rock</option>
<option value="23">Killas slate</option>
<option value="3">Limestone</option>
<option value="24">Mica schist</option>
<option value="21">Microgranite</option>
<option value="26">Pillow lava</option>
<option value="11">Quartzite</option>
<option value="6">Rhyolite</option>
<option value="8">Sandstone (hard)</option>
<option value="7">Sandstone (soft)</option>
<option value="18">Schist</option>
<option value="45">Serpentine</option>
<option value="9">Shale</option>
<option value="2">Slate</option>
<option value="15">Trachyte</option>
<option value="1" class="error">UNKNOWN</option>
<option value="44">Volcanic tuff</option>
<option value="42">Welded Tuff</option>
<option value="31">Welsh igneous</option>
</select>
