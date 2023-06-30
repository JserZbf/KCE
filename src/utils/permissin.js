// var admin = ['add', 'edit', 'del'];

export const hasRole = {
    install: (app) => {
        app.directive('hasRole', {
            mounted(el, binding) {
                // roles的值，应为string数组，存放角色列表  例子：['add','edit','del']        
                // 也可以根据自己的逻辑修改       
                var user = localStorage.getItem('$user');
                if (user) {
                    user = JSON.parse(user);
                }
                const roles = [user?.role];
                const value = binding.value;
                let flag = value.filter((v) => { return roles.indexOf(v) != -1 })
                console.log(flag);
                if (flag.length <= 0) {
                    if (!el.parentNode) { el.style.display = 'none' }
                    else { el.parentNode.removeChild(el) }
                }
            },
        })
    },
}
