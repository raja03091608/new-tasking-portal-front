$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
/* Allow only alphanumeric characters */
$('.alphanumeric').keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
});
/* Max length definition */
$(document).on('keyup','input',function(e){
    var max = $(this).attr('maxlength');
	if(typeof(max)!='undefined')
	{
		if($(this).val().length > max) 
			$(this).val($(this).val().substr(0, max));
	}
});
/* Allow positive numbers */
$(".allowPositive").keydown(function (event) {
	if (event.shiftKey)
		event.preventDefault();
	if (event.keyCode == 46 || event.keyCode == 8) {
	}
	else {
		if (event.keyCode < 95) {
			if (event.keyCode < 48 || event.keyCode > 57) 
				event.preventDefault();
		}
		else {
			if (event.keyCode < 96 || event.keyCode > 105) 
				event.preventDefault();
		}
	}
});
/* Numeric only */
$(document).on('keypress','input.numericOnly,input.numbersOnly',function(e){ 
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))  return false;
});
$(document).on('input','input.numericOnly,input.numbersOnly',function(e){ 
	let input=e.target;
	let value = input.value;
  	let numbers = value.replace(/[^0-9]/g, "");
  	input.value = numbers;
});

$(document).on('keypress','input.no_special_chars',function(e){
	if (e.which < 48 || 
	    (e.which > 57 && e.which < 65) || 
	    (e.which > 90 && e.which < 97) ||
	    e.which > 122) {
	    e.preventDefault();
		return false;
	}
});
function openModal(selector)
{
	$(selector).modal('show');
}

function closeModal(selector)
{
	// $('.modal').modal({backdrop:'static'});
	$(selector).modal('hide');
}
function closeAllActiveModals()
{
	$('.modal').modal('hide');
	$('.modal-backdrop').remove();
}

function formSubmit(selector)
{
	$(selector).submit();
}
function triggerClick(selector)
{
	$(selector).trigger('click');
}

$(document).on('click','.package-place-order',function(){
	$(this).closest('.form-row').toggleClass('active');
	//console.log('package change');
});

$(document).on('click','.mat-datepicker-input',function(){
	$(this).closest('.mat-form-field').find('.mat-datepicker-toggle').trigger('click');
});

function arrayColumn(array, columnName) {
    return array.map(function(value,index) {
        return value[columnName];
    });
}

function inArray(needle, haystack) {
	if(Array.isArray(haystack))
	{
		var length = haystack.length;
		for(var i = 0; i < length; i++) {
			if(haystack[i] == needle) return true;
		}
		return false;
	}
	else
		return false;
}