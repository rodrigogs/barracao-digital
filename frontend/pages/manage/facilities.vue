<template>
  <div>
    Facilities list here!
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'isAdminOrMaster']
}
</script>
