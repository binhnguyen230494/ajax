var homeconfig = {
    pageSize:5,
    pageindex:1
}
var home = {
    init: function () {
        home.loadData();
        home.registerEvent();
    },
    registerEvent: function () {
        $('#frmSaveData').validate({
            rules: {
                txtName: {
                    required: true,
                    minlength: 5
                },
                txtsalary: {
                    required: true,
                    number: true,
                    min: 0
                }
            },
            messages: {
                txtName: {
                    required: "Bạn phải nhập tên",
                    minlength: "Tên phải lớn hơn 5 ký tự"
                },
                txtsalary: {
                    required: "Bạn phải nhập lương",
                    number: "Lương phải là số",
                    min: "Lương của bạn phải lớn hơn hoặc bằng 0"
                }
            }
        });
       
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
            if ($('#frmSaveData').valid()) {
                home.saveData();
            }
        });
        $('.btn-edit').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
            var id = $(this).data('id');
            home.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Are you sure to delete this employee?", function (result) {
                home.deleteEmployee(id);
            });
        });
        $('#btnSearch').off('click').on('click', function () {
            home.loadData(true);
        });
        $('#txtNameS').off('keypress').on('keypress', function (e) {
            if (e.which == 13) {
                home.loadData(true);
            }
        });
        $('#btnReset').off('click').on('click', function () {
            $('#txtNameS').val('');
            $('#ddlStatusS').val('');
            home.loadData(true);
        });
    },
    deleteEmployee: function (id) {
        $.ajax({
            url: '/Home/Delete',
            data: {
                id: id
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Delete Success", function () {
                        home.loadData(true);
                    });
                }
                else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Home/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    var data = response.data;
                    $('#hidID').val(data.ID);
                    $('#txtName').val(data.Name);
                    $('#txtsalary').val(data.Salary);
                    $('#ckStatus').prop('checked', data.Status);
                }
                else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
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
                    bootbox.alert("Save Success", function () {
                        $('#modalAddUpdate').modal('hide');
                        home.loadData(true);
                    });
                }

                
                else {
                    bootbox.alert(response.message);
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
                    bootbox.alert('Update success.');
                }
                else {
                    bootbox.alert('Update failed.');
                }
            }
        })
    },
    loadData: function (changePageSize) {
        var name = $('#txtNameS').val();
        var status = $('#ddlStatusS').val();
        $.ajax({
            url: '/Home/LoadData',
            type: 'Get',
            data: {
                name: name,
                status: status,
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
                    }, changePageSize);
                    home.registerEvent();
                }
            }

        })
    },
    paging: function (totalRow, callback, changePageSize) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }
        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: "Đầu",
            next: "Tiếp",
            last: "Cuối",
            prev: "Trước",
            visiblePages: 10,
            onPageClick: function (event, page) {
                homeconfig.pageindex = page;
                setTimeout(callback, 200);
            }
        });
    }
}
home.init();