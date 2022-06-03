
$("#add_record").submit(function(event){

    alert("Food recorded Inserted Successfully")
})

$("#update_record").submit(function(event){

    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n,i){
        data[n['name']]= n['value']

    })


    data['calories'] = (parseInt(data.food_weight)*parseInt(data.calories_hundred))/100
    console.log(data)

    var request = {
        "url" : `http://localhost:3000/api/food/${data.id}`,
        "method" : "PUT",
        "data": data
    }
    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})
//change the home to "/"
if(window.location.pathname=="/food-home" || window.location.pathname=="/"){

    $ondelete= $(".table tbody td a.delete");
    $delete_btn.click(function(){
        var id = $(this).attr("data-id")
        console.log(id)

        var request = {
            "url" : `http://localhost:3000/api/food/${id}`,
            "method" : "DELETE"
            
        }
        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!")
                location.reload()

            })

        }
    })
}