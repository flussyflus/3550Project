(function(window){
    $(document).ready(function(){
         
	//dynmically load student ids in options menu
		$("#view3b1").click(function(){
			var MenuContent = "";
			$("#view3d2").html(MenuContent);
            var today = getTodaysDate();
            $.get("/prjt/mem3/getDailyTable",{today:today},function(data){
                var i;
                arr = orderList(data,"username");
                 MenuContent = "<select id='selStu3' class='IDmenu'><option selected ='selected' value ='nothing'>Choose ID</option>";
                for(i= 0; i < data.length; i++){	
						MenuContent += '<option id ='+arr[i]+' value="'+arr[i]+'">' + arr[i]  + "</option>";	
				}
                MenuContent += "</select>";
                $("#view3d1").html(MenuContent); 
            },"json");
        });
		
		//load table for selected Student ID
		$(document).on("change","#selStu3",function(){
            var user = $(this).val();
            var today = getTodaysDate();
            $.get("/prjt/mem3/getTodayLogTable",{user:user,today:today},function(data){
                var i;
                var content = "<h2 class='text-center'>Student " + user + " Log for "+ today +"</h2><table id='mytable' class='table table-striped table-bordered'><thead><tr><th>Date</th><th>Computer ID</th><th>Session Time(min)</th></tr></thead><tbody>";
                for(i= 0; i < data.length; i++){
					if(data[i].username === user){
						content += '<tr><td>' + data[i].date  + '</td>' + '<td>' + data[i].comp_id  + '</td>' + '<td>' + data[i].time + '</td></tr>';
					}
				}
                content += "</tbody></table>";
                $("#view3d2").html(content);
            },"json");
		});
		
		
		//load table for selected Computer ID
		$(document).on("change","#selComp",function(){
            var comp = $(this).val();
            var today = getTodaysDate();
            $.get("/prjt/mem3/getTodayCompLogTable",{comp:comp,today:today},function(data){
                var i;
                var content = "<h2 class='text-center'>Computer " + comp + " Log for "+ today +"</h2><table id='mytable' class='table table-striped table-bordered'><thead><tr><th>Date</th><th>User logged in</th><th>Session Time(min)</th></tr></thead><tbody>";
                for(i= 0; i < data.length; i++){
					if(data[i].comp_id === comp){
						content += '<tr><td>' + data[i].date  + '</td>' + '<td>' + data[i].username  + '</td>' + '<td>' + data[i].time + '</td></tr>';
					}
				}
                content += "</tbody></table>";
                $("#view3d2").html(content);
            },"json");
		});
    
 
	//dynamically loading the computer IDs for the "select a computer" button
	$("#view3b2").click(function(){
			var content = "";
			$("#view3d2").html(content);
            var today = getTodaysDate();
            $.get("/prjt/mem3/getDailyCompTable",{today:today},function(data){
                var i,arr = [];
                arr = orderList(data,"comp_id");
                var MenuContent = "<select id='selComp' class='IDmenu'><option selected ='selected' value ='nothing'>Choose ID</option>";
                for(i= 0; i < data.length; i++){
						MenuContent += '<option id ='+arr[i]+' value="'+arr[i]+'">' + arr[i]  + "</option>";	
				}
                MenuContent += "</select>";
                $("#view3d1").html(MenuContent);
            },"json");
        });
	
		//code to display all log data after clicking the button
		$("#view3b3").click(function(){
			var content ="";
			$("#view3d1").html(content);
			var today= getTodaysDate();
			$.get("/prjt/mem3/getAllDailyTable",{today:today},function(data){
                var i;
                var content = "<h2 class='text-center'>Date Log: " + data[0].date + " </h2><table id='mytable' class='table table-striped table-bordered'><thead><tr><th>Username</th><th>Computer Id</th><th>Session Time(min)</th></tr></thead><tbody>";
                for(i= 0; i < data.length; i++){
                    content += '<tr><td>' + data[i].username + '</td>' + '<td>' + data[i].comp_id  + '</td>' + '<td>' + data[i].time + '</td></tr>';
                }
                content += "</tbody></table>";
                $("#view3d2").html(content);
            },"json");
		
			
		});
	
        
		//load line chart for button 4
		$("#view3b4").click(function(){
			var today = getTodaysDate();
			$.get("/prjt/mem3/getDailyGraph",{today:today},function(data){
				var i,k;var timesSeen = [];
				var unSeen = true; var freq = [];
				for(i=0;i<data.length;i++){
					for(k=0;k<timesSeen.length;k++){
						if(data[i].time === timesSeen[k]){
							freq[k] = freq[k] +1;
							unSeen = false;
						}
					}
						if(unSeen === true){
							freq[freq.length] = 1;
							timesSeen[timesSeen.length] = data[i].time;
						}
						unSeen = true;
				}
				//sorts the timesSeen and the freq chart in ascending order
                
				for(i=0;i<timesSeen.length;i++){
					for(k=0;k<timesSeen.length;k++){
						if(parseInt(timesSeen[k]) > parseInt(timesSeen[i])){
							var temp = timesSeen[k];
							timesSeen[k] = timesSeen[i];
							timesSeen[i] = temp;
							var temp2 = freq[k];
							freq[k] = freq[i];
							freq[i] = temp2;
						}
					}
				}
				//console.log(typeof(timesSeen[0]));
				$('#view3d2').highcharts({
            title: {
                text: 'Time Spent Logged In',
                x: -20 //center
            },
            
            xAxis: {
				title:{
					text:'Time'
					},
                categories: timesSeen
            },
            yAxis: {
                title: {
                    text: 'Frequency'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Usage Frequency',
                data: freq
            }]
        });
			
			},"json");
		});

	
		//load pie chart for button 5					
		$("#view3b5").click(function(){
			var today = getTodaysDate();
            $.get("/prjt/mem3/getDailyGraph",{today:today},function(data) {
                
				//need to calculate the actual data for pie chart
				var i,j,k;var finalArrayData = [];
				var unSeen = true;var pcsSeen = [];
					for(i= 0; i < data.length; i++){
                        for(j=0;j<pcsSeen.length;j++){
                            if(data[i].comp_id === pcsSeen[j]){
                                unSeen = false;
                            }
                        }
                        if(unSeen === true){
                            pcsSeen[pcsSeen.length] = data[i].comp_id;
                        }
                        unSeen = true;
				    }

				for(k=0;k<pcsSeen.length;k++){
                    var temp=[],sum;
                    sum = getSum(data,pcsSeen[k]);
                    temp.push("comp ID: "+pcsSeen[k],sum);
                    finalArrayData[k] = temp;
                }

				//loads pie chart
				$("#view3d2").highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: true
                    },
                    title: {
                        text: 'Usage of PCs  '
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: pcsSeen,
                        data: finalArrayData
                    }]
				});					
			},"json");
            
		});
	
	//jquery get for the User Info Button
        $("#p3Info").click(function(){
            $.get("/prjt/mem3/getTable",function(data){
                var content = "<h2 class='text-center'>Student " + data.username + " Information</h2><table id='mytable' class='table table-striped table-bordered'><thead><tr><th>Id</th><th>Username(Student Id)</th><th>User Type</th></tr></thead><tbody>";
                content += '<tr><td>' + data.id  + '</td>' + '<td>' + data.username  + '</td>' + '<td>' + data.type + '</td></tr>';
                content += "</tbody></table>";
                $("#dispInfo").html(content); 
            },"json");
        });
        
        //jquery get for the Log Table Button
        $("#p3LogTable").click(function(){
            $.get("/prjt/mem3/getLogTable",function(data){
                var i;
                var content = "<h2 class='text-center'>Student " + data[0].username + " Log</h2><table id='mytable' class='table table-striped table-bordered'><thead><tr><th>Date</th><th>Computer Id</th><th>Session Time(min)</th></tr></thead><tbody>";
                for(i= 0; i < data.length; i++){
                    content += '<tr><td>' + data[i].date  + '</td>' + '<td>' + data[i].comp_id  + '</td>' + '<td>' + data[i].time + '</td></tr>';
                }
                content += "</tbody></table>";
                $("#dispInfo").html(content); 
            },"json");
        });
        
        
        /*$("#grp4b3").click(function(){
            

		
	   });*/
        
        $("#p3Bargraph").click(function(){
             $.get("/prjt/mem3/getLogTable",function(data) {
                var i,time=[],date=[];
                for(i = 0; i < data.length; i++){
                    time.push(parseInt(data[i].time));
                    date.push(data[i].date);
                }
                 
                $('#dispInfo').highcharts({
                    
                    chart: {
                        type: 'bar',
                        borderWidth: 2
                    },
                    title: {
                        text: 'Date vs Time(length of usage)'
                    },
                    xAxis: {
                        categories: date
                    },
                    yAxis: {
                        title: {
                            text: 'Time'
                        }
                    },
                    series: [{
                        name: 'Time',
                        data: time
                    }]
                });
            
            },"json");
        });
		
		
		
		
		
		
		
    });
		
        
 
    //function to get today's date
    function getTodaysDate(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;        
        var yyyy = today.getFullYear();
        
        if(dd<10){dd='0'+dd} 
        if(mm<10){mm='0'+mm} 
        today = dd+'-'+mm+'-'+yyyy;
        
        return today;   
    }
    
    function orderList(d,str){
        var arr = [],i;
        for(i=0;i<d.length;i++)
            arr[i] = d[i][str];
        arr.sort();
        
        return arr;
    }
        
    function getSum(data,key){
        var sum=0,i;
        for(i=0;i<data.length;i++){
            if(key === data[i].comp_id){
                sum = sum +  parseInt(data[i].time);
            }
        }
        return sum;
    }
	
	
}(this));
