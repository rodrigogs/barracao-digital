<template>
  <div>
    Doctors list here!
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'isAdminOrMaster']
}
</script>
