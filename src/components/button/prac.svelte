<script lang="ts">
    export let text: string | number;
    export let padding: string | undefined = undefined;
</script>

<div style={`${padding ? `padding: ${padding}:` : ''}`}>
<div class="title">
    <slot name="tilte" />
</div>
123123
<div class="content"><slot name="content"/></div>
</div>
