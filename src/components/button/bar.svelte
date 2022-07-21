<script lang="ts">
    // import { }
    let data: number[] = [1,2,3,4,5];
</script>

<script>
    //TODO: bargraph와 자식 baritem 컴포넌트 생성, 다음주과제
<BarGraph>
    {#each data as item}
    <BarItem {item} />
</BarGraph>

</script>