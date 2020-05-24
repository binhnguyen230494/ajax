var homeconfig = {
    pageSize: 2,
    pageindex:1
}
var home = {
    init: function () {
        home.loadData();
        home.registerEvent();
    },
    registerEvent: function () {
       
        $('.txtsalary').off('keypress').on('keypress', function (e) {
            if (e.which == 13) 
                {
                    var id = $(this).data('id');
                    var value = $(this).val();
                home.updateSalary(id, value);
                var index = $('.txtsalary').index(this) + 1;
                $('.txtsalary').eq(index).focus();
                $('.txtsalary').eq(index).select();
                }
            
        });
        
    },
    updateSalary: function (id, value) {
        var data = {
            ID: id,
            Salary: value
        };
        $.ajax({
            url: 'Home/Update',
            type: 'POST',
            dataType: 'json',
            data: { model: JSON.stringify(data)  },
            success: function (reponse) {
                if (reponse.Status) {
                    alert('Update success.');
                }
                else {
                    alert('Update failed.');
                }
            }
        })
    },
    loadData: function () {
        $.ajax({
            url: '/Home/LoadData',
            type: 'Get',
            data: {
                page: homeconfig.pageindex,
                pageSize: homeconfig.pageSize

        },
            dataType: 'json',
            success: function (response) {
                if (response.Status) {
                    var data = response.data;
                    var html = '';
                    var tem = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(tem, {
                            ID: item.ID,
                            Salary: item.Salary,
                            Name: item.Name,
                            Status: item.Status == true ? "<span class=\"label label-success\">Active</span>": "<span class=\"label label-danger\">Locked</span>"
                        });
                    });
                    $('#tbData').html(html);
                    home.paging(response.total, function () {
                        home.loadData();
                    });
                    home.registerEvent();
                }
            }

        })
    },
    paging: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
        $('#pagination').twbsPagination({
            totalPages: totalPage,
            visiblePages: 10,
            onPageClick: function (event, page) {
                homeconfig.pageindex = page;
                setTimeout(callback, 200);
            }
        });
    }
}
home.init();