var homeconfig = {
    pageSize:20,
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
        $('#btnAddNew').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
            home.resetForm();
        }); 
        $('#btnSave').off('click').on('click', function () {
            
                home.saveData();
            
        });
    },
    saveData: function () {
        var name = $('#txtName').val();
        var salary = parseFloat($('#txtsalary').val());
        var status = $('#ckStatus').prop('checked');
        var id = parseInt($('#hidID').val());
        var employee = {
            Name: name,
            Salary: salary,
            Status: status,
            ID: id
        }
        $.ajax({
            url: '/Home/Save',
            data: {
                strmodel: JSON.stringify(employee)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    alert("Save Success");
                        $('#modalAddUpdate').modal('hide');
                        home.loadData(true);
                }

                
                else {
                    alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    resetForm: function () {
        $('#hidID').val('0');
        $('#txtName').val('');
        $('txtsalary').val(0);
        $('#ckStatus').prop('checked', true);
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
                setTimeout(callback, 20);
            }
        });
    }
}
home.init();